/**
 * @file src/workflows/defaultWorkflow.js
 */
module.exports = {
    name: "defaultWorkflow",
    description: `Automated pipeline`,
    type: "PIPELINE",
    state: "IDLE", // 'IDLE', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'
    status: "IDLE", // 'IDLE', 'RUNNING', 'COMPLETED', 'FAILED'
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
            // timestamp // Timestamp when the pipeline started,
        }
    ],
    on_failure: [
        {
            type: "function",
            name: "handlePipelineFailure",
            // timestamp // Timestamp when the pipeline failure
        }
    ],
    on_success: [
        {
            type: "status",
            name: "completed",
            // timestamp // Timestamp when the pipeline completed
        }
    ],
    steps: [
        {
            name: "dataPreprocessing",
            description: `Retrieve and process data from multiple sources for initial analysis`,
            type: "WORKFLOW",
            state: "IDLE", // 'IDLE', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'
            status: "PENDING", // 'PENDING', 'RUNNING', 'SUCCESS', 'FAILED'
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
                    // timestamp // Timestamp when the workflow started,
                }
            ],
            on_failure: [
                {
                    type: "function",
                    name: "handleWorkflowFailure",
                    // timestamp // Timestamp when the workflow failure
                }
            ],
            on_success: [
                {
                    type: "status",
                    name: "completed",
                    // timestamp // Timestamp when the workflow completed
                }
            ],
            steps: [
                {
                    name: "loadDataSources",
                    description: `Request data from external services and load them into the system`,
                    type: "task",
                    state: "IDLE", // 'IDLE', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'
                    status: "IDLE", // 'IDLE', 'RUNNING', 'COMPLETED', 'FAILED'
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
                            type: "status",
                            name: "completed"
                        }
                    ]
                }
            ]
        }
    ]
};
