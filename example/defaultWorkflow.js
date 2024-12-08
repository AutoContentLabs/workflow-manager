/**
 * @file example/defaultWorkflow.js
 */
module.exports = {
    name: "autoDataProcessing",
    description: `Automated DAG-based workflow with data processing and analysis`,
    type: "pipeline",
    status: 'idle', // idle, pending, running, completed, failed
    dependencies: [],
    on_start: [
        {
            type: "config",
            name: "initialConfiguration",
            parameters: {
                checkpoint: true,  // Enable checkpointing for task consistency
                state: true, // Enable state tracking
                parallel: true, // Enable parallel processing within the pipeline
                schedule: "0 * * * *", // Cron job: run every hour
                timeout: 120, // Set maximum allowed runtime for each task
                retries: 3, // Number of retries in case of task failure
            },
            timestamp: "",
        }
    ],
    on_failure: [
        {
            type: "function",
            name: "handlePipelineFailure",
            timestamp: ""
        }
    ],
    on_success: [
        {
            type: "status",
            name: "completed",
            timestamp: ""
        }
    ],
    steps: [
        {
            name: "dataPreprocessing",
            description: `Retrieve and process data from multiple sources for initial analysis`,
            type: "workflow",
            dependencies: [],
            on_start: [
                {
                    type: "config",
                    name: "workflowConfiguration",
                    parameters: {
                        checkpoint: true,  // Enable checkpointing
                        state: true, // Enable state tracking
                        parallel: true, // Enable parallel execution of steps
                        timeout: 60, // Maximum allowed time for this task
                        retries: 2, // Retry the task up to 2 times on failure
                    },
                    timestamp: ""
                }
            ],
            on_failure: [
                {
                    type: "function",
                    name: "handleWorkflowFailure",
                    timestamp: ""
                }
            ],
            on_success: [
                {
                    type: "status",
                    name: "completed",
                    timestamp: ""
                }
            ],
            steps: [
                {
                    name: "loadDataSources",
                    description: `Request data from external services and load them into the system`,
                    type: "task",
                    dependencies: [],
                    on_start: [
                        {
                            type: "service",
                            name: "data-source-service",
                            parameters: {
                                checkpoint: true,
                                state: true,
                                parallel: true,
                                timeout: 30,
                                retries: 3,
                            },
                            input: {
                                storage: {
                                    database: "mysql",
                                    collection: "service_data",
                                    flow: "incoming"
                                }
                            },
                            output: {
                                format: "json",
                                data: []
                            },
                        }
                    ],
                    on_failure: [
                        {
                            type: "function",
                            name: "handleTaskFailure"
                        }
                    ],
                    on_success: [
                        {
                            type: "step",
                            name: "processData"
                        }
                    ]
                },
                {
                    name: "processData",
                    description: `Process the loaded data and prepare it for further analysis`,
                    type: "task",
                    dependencies: [
                        {
                            type: "step",
                            name: "loadDataSources"
                        }
                    ],
                    on_start: [
                        {
                            type: "service",
                            name: "data-processor-service",
                            parameters: {
                                parallel: false,
                                timeout: 45,
                                retries: 2,
                            },
                            input: {
                                storage: {
                                    database: "mongodb",
                                    collection: "processed_data",
                                    flow: "outgoing"
                                }
                            },
                            output: {
                                format: "json",
                                data: []
                            },
                        }
                    ],
                    on_failure: [
                        {
                            type: "function",
                            name: "handleTaskFailure"
                        }
                    ],
                    on_success: [
                        {
                            type: "step",
                            name: "dataAnalysis"
                        }
                    ]
                }
            ]
        },
        {
            name: "dataAnalysis",
            description: `Analyze the processed data and generate insights for reporting`,
            type: "workflow",
            dependencies: [],
            on_start: [
                {
                    type: "config",
                    name: "analysisConfig",
                    parameters: {
                        parallel: false,
                        timeout: 60,
                        retries: 3,
                    }
                }
            ],
            on_failure: [
                {
                    type: "function",
                    name: "handleWorkflowFailure"
                }
            ],
            on_success: [
                {
                    type: "status",
                    name: "completed"
                }
            ],
            steps: [
                {
                    name: "performAnalysis",
                    description: `Send data to the data-analyzer service for analysis and save the results`,
                    type: "task",
                    dependencies: [],
                    on_start: [
                        {
                            type: "service",
                            name: "data-analyzer-service",
                            parameters: {
                                parallel: false,
                                timeout: 45,
                                retries: 2,
                            },
                            input: {
                                storage: {
                                    database: "postgresql",
                                    collection: "analysis_results",
                                    flow: "outgoing"
                                }
                            },
                            output: {
                                format: "json",
                                data: []
                            },
                        }
                    ],
                    on_failure: [
                        {
                            type: "function",
                            name: "handleTaskFailure"
                        }
                    ],
                    on_success: [
                        {
                            type: "step",
                            name: "sendNotification"
                        }
                    ]
                },
                {
                    name: "sendNotification",
                    description: `Notify stakeholders of the analysis results and schedule next cycle`,
                    type: "task",
                    dependencies: [
                        {
                            type: "step",
                            name: "performAnalysis"
                        }
                    ],
                    on_start: [
                        {
                            type: "service",
                            name: "notification-service",
                            parameters: {
                                parallel: false,
                                timeout: 15,
                                retries: 2,
                            },
                        }
                    ],
                    on_failure: [
                        {
                            type: "function",
                            name: "handleTaskFailure"
                        }
                    ],
                    on_success: [
                        {
                            type: "status",
                            name: "completed"
                        }
                    ]
                }
            ]
        }
    ]
};
