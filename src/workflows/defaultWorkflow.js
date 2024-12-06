/**
 * @file src/workflows/defaultWorkflow.js
 */
module.exports = {
    "id": 1,
    "name": "auto-content",
    "steps": [
        {
            "name": "step1",
            "type": "ACTION",
            "task": "JOB_SCHEDULE_CREATE",
            "parameters": { "url": process.env.API_URL, "method": "GET" },
            "onSuccess": "step2",
            "onFailure": "handleFailure",  // Define this step to handle failures
        },
        {
            "name": "step2",
            "type": "ACTION",
            "task": "DATA_COLLECT_REQUEST",
            "parameters": { "url": process.env.API_URL, "method": "GET" },
            "onSuccess": "step3",
            "onFailure": "handleFailure",
        },
        {
            "name": "step3",
            "type": "ACTION",
            "task": "DATA_COLLECT_RESPONSE",
            "onSuccess": "step4",
            "onFailure": "handleFailure",
            "parameters": {}  // Make sure this is dynamic if needed
        },
        {
            "name": "step4",
            "type": "ACTION",
            "task": "DATA_PROCESSING_START",
            "onSuccess": "step5",
            "onFailure": "handleFailure",
            "parameters": {}  // Ensure correct parameters are passed
        },
        {
            "name": "step5",
            "type": "ACTION",
            "task": "DATA_PROCESSING_RESULT",
            "onSuccess": null,  // End of the process or handover to another workflow
            "onFailure": "handleFailure",
            "parameters": {}
        },
        {
            "name": "step6",
            "type": "ACTION",
            "task": "DATA_STORAGE",
            "onSuccess": "step7",
            "onFailure": "handleFailure",
            "parameters": {}
        },
        {
            "name": "step7",
            "type": "ACTION",
            "task": "DATA_AGGREGATION",
            "onSuccess": "step8",
            "onFailure": "handleFailure",
            "parameters": {}
        },
        {
            "name": "step8",
            "type": "ACTION",
            "task": "ANALYSIS_REQUEST",
            "onSuccess": "step9",
            "onFailure": "handleFailure",
            "parameters": {}
        },
        {
            "name": "step9",
            "type": "ACTION",
            "task": "ANALYSIS_RESULT",
            "onSuccess": "step10",
            "onFailure": "handleFailure",
            "parameters": {}
        },
        {
            "name": "step10",
            "type": "ACTION",
            "task": "REPORT",
            "onSuccess": "step11",  // Possible final step in the workflow
            "onFailure": "handleFailure",
            "parameters": {}
        },
        {
            "name": "step11",
            "type": "ACTION",
            "task": "NOTIFICATION",  // Send notifications after the workflow completes
            "onSuccess": null,  // No further steps (end of the workflow)
            "onFailure": "handleFailure",
            "parameters": {}
        },
        {
            "name": "handleFailure",
            "type": "ACTION",
            "task": "FAILURE_HANDLING",  // Define a task for failure handling
            "onSuccess": null,  // End the process after failure handling
            "onFailure": null,
            "parameters": { "message": "Workflow failed at step: {step.name}" }  // Pass failure details
        }
    ]
};
