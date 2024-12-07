// createWorkflow.js
/**
* Example of creating a workflow with Fetch.
 */
new Event
const createWorkflow = async () => {
    try {
        const response = await fetch('http://localhost:5000/workflow/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    "name": "data-processing-pipeline",
                    "description": "This data processing pipeline consists of jobs that manage the extraction, transformation, processing, storage, aggregation, analysis, report generation, and user notification from data acquisition to the reporting phase.",
                    "jobs": [
                        {
                            "name": "data-extraction-job",
                            "description": "This job manages the extraction of data from the source.",
                            "tasks": [
                                {
                                    "name": "extractData",
                                    "type": "SIGNAL",
                                    "task": "EXTRACT_DATA",
                                    "service": "data-source-service",
                                    "parameters": {
                                        "db": "mysql",
                                        "table": "service"
                                    },
                                    "dependencies": [],
                                    "onSuccess": ["data-transformation-job"],
                                    "onFailure": "handleExtractionFailure",
                                    "retries": 3,
                                    "timeout": 15,
                                    "description": "Data is extracted from the database and passed to the transformation stage."
                                }
                            ]
                        },
                        {
                            "name": "data-transformation-job",
                            "description": "This job manages the transformation of data into a usable format for analysis.",
                            "tasks": [
                                {
                                    "name": "transformData",
                                    "type": "SIGNAL",
                                    "task": "TRANSFORM_DATA",
                                    "service": "data-transformer-service",
                                    "parameters": {},
                                    "dependencies": ["data-extraction-job"],
                                    "onSuccess": ["data-collection-job"],
                                    "onFailure": "handleTransformationFailure",
                                    "retries": 3,
                                    "timeout": 15,
                                    "description": "Data is transformed and prepared for further processing."
                                }
                            ]
                        },
                        {
                            "name": "data-collection-job",
                            "description": "This job collects, aggregates, and prepares the data for processing.",
                            "tasks": [
                                {
                                    "name": "collectData",
                                    "type": "SIGNAL",
                                    "task": "COLLECT_DATA",
                                    "service": "data-collector-service",
                                    "parameters": {},
                                    "dependencies": ["data-transformation-job"],
                                    "onSuccess": ["data-processing-job"],
                                    "onFailure": "handleCollectionFailure",
                                    "retries": 3,
                                    "timeout": 15,
                                    "description": "Data is collected, aggregated, and filtered for further processing."
                                }
                            ]
                        },
                        {
                            "name": "data-processing-job",
                            "description": "This job handles the processing of collected data for final analysis.",
                            "tasks": [
                                {
                                    "name": "processData",
                                    "type": "SIGNAL",
                                    "task": "PROCESS_DATA",
                                    "service": "data-processor-service",
                                    "parameters": {},
                                    "dependencies": ["data-extraction-job", "data-transformation-job", "data-collection-job"],
                                    "onSuccess": ["data-storage-job"],
                                    "onFailure": "handleProcessingFailure",
                                    "retries": 3,
                                    "timeout": 15,
                                    "description": "Data is processed and made more suitable for analysis."
                                }
                            ]
                        },
                        {
                            "name": "data-storage-job",
                            "description": "This job stores processed data into the database or data warehouse.",
                            "tasks": [
                                {
                                    "name": "storeData",
                                    "type": "SIGNAL",
                                    "task": "STORE_DATA",
                                    "service": "data-storage-service",
                                    "parameters": {},
                                    "dependencies": ["data-extraction-job", "data-transformation-job", "data-collection-job", "data-processing-job"],
                                    "onSuccess": ["data-aggregation-job"],
                                    "onFailure": "handleStorageFailure",
                                    "retries": 3,
                                    "timeout": 15,
                                    "description": "Processed data is stored in a database or data warehouse."
                                }
                            ]
                        },
                        {
                            "name": "data-aggregation-job",
                            "description": "This job handles the aggregation of stored data for analysis.",
                            "tasks": [
                                {
                                    "name": "aggregateData",
                                    "type": "SIGNAL",
                                    "task": "AGGREGATE_DATA",
                                    "service": "data-aggregator-service",
                                    "parameters": {},
                                    "dependencies": ["data-extraction-job", "data-transformation-job", "data-collection-job", "data-processing-job", "data-storage-job"],
                                    "onSuccess": ["data-analysis-job"],
                                    "onFailure": "handleAggregationFailure",
                                    "retries": 3,
                                    "timeout": 15,
                                    "description": "Data is aggregated and prepared for analysis."
                                }
                            ]
                        },
                        {
                            "name": "data-analysis-job",
                            "description": "This job analyzes the aggregated data to derive insights.",
                            "tasks": [
                                {
                                    "name": "analyzeData",
                                    "type": "SIGNAL",
                                    "task": "ANALYZE_DATA",
                                    "service": "data-analyzer-service",
                                    "parameters": {},
                                    "dependencies": ["data-extraction-job", "data-transformation-job", "data-collection-job", "data-processing-job", "data-storage-job", "data-aggregation-job"],
                                    "onSuccess": ["report-generation-job"],
                                    "onFailure": "handleAnalysisFailure",
                                    "retries": 3,
                                    "timeout": 15,
                                    "description": "Data is analyzed to derive meaningful insights."
                                }
                            ]
                        },
                        {
                            "name": "report-generation-job",
                            "description": "This job generates a report based on the analysis results.",
                            "tasks": [
                                {
                                    "name": "generateReport",
                                    "type": "SIGNAL",
                                    "task": "GENERATE_REPORT",
                                    "service": "report-generator-service",
                                    "parameters": {},
                                    "dependencies": ["data-extraction-job", "data-transformation-job", "data-collection-job", "data-processing-job", "data-storage-job", "data-aggregation-job", "data-analysis-job"],
                                    "onSuccess": ["notification-job"],
                                    "onFailure": "handleReportGenerationFailure",
                                    "retries": 3,
                                    "timeout": 15,
                                    "description": "A report is generated based on the analysis results."
                                }
                            ]
                        },
                        {
                            "name": "notification-job",
                            "description": "This job sends a notification once the entire pipeline has completed.",
                            "tasks": [
                                {
                                    "name": "notifyCompletion",
                                    "type": "SIGNAL",
                                    "task": "NOTIFY_COMPLETION",
                                    "service": "notification-service",
                                    "parameters": {},
                                    "dependencies": ["data-extraction-job", "data-transformation-job", "data-collection-job", "data-processing-job", "data-storage-job", "data-aggregation-job", "data-analysis-job", "report-generation-job"],
                                    "onSuccess": ["data-extraction-job"],
                                    "onFailure": "handleNotificationFailure",
                                    "retries": 3,
                                    "timeout": 15,
                                    "description": "Upon completion, a notification is sent to the user, and the process starts over by extracting new data from the source."
                                }
                            ]
                        }
                    ]
                }
            ),
        });

        // Throw an error if the request is not successful
        if (!response.ok) {
            const errorText = await response.text();  // Get the error message
            throw new Error(`Workflow creation failed: ${response.statusText}, ${errorText}`);
        }

        const data = await response.json();
        console.log('Workflow created:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

// Start creating a workflow
createWorkflow();
