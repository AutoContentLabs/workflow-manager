/**
 * @file example/index.js
 */
require('dotenv').config(); // Load the .env file

const workflowDefinition = {
    "name": "auto-content",
    "steps": [
        {
            "name": "step1",
            "type": "ACTION",
            "task": "JOB_SCHEDULE_CREATE",
            "parameters": { "url": process.env.API_URL, "method": "GET" },
            "onSuccess": "step2",
            "onFailure": "handleFailure",
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
            "type": "action",
            "task": "DATA_COLLECT_RESPONSE",
            "onSuccess": "step4",
            "onFailure": "handleFailure",
            "parameters": {}
        },
        {
            "name": "step4",
            "type": "ACTION",
            "task": "DATA_PROCESSING_START",
            "onSuccess": "step5",
            "onFailure": "handleFailure",
            "parameters": {}
        },
        {
            "name": "step5",
            "type": "ACTION",
            "task": "DATA_PROCESSING_RESULT",
            "onSuccess": null,
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
            "onSuccess": "step11",
            "onFailure": "handleFailure",
            "parameters": {}
        },
        {
            "name": "step11",
            "type": "ACTION",
            "task": "NOTIFICATION",
            "onSuccess": null,
            "onFailure": "handleFailure",
            "parameters": {}
        },
    ]
};

// Dynamic workflow name based on the current date
const workflowDefinitionNew = {
    "name": "example_" + new Date().toISOString(),
    "steps": [
        {
            "name": "step1",
            "type": "ACTION",
            "task": "JOB_SCHEDULE_CREATE",
            "parameters": { "url": process.env.API_URL, "method": "GET" },
            "onSuccess": "step2",
            "onFailure": "handleFailure",
        },
        {
            "name": "step2",
            "type": "ACTION",
            "task": "DATA_COLLECT_REQUEST",
            "parameters": { "url": process.env.API_URL, "method": "GET" },
            "onSuccess": null,
            "onFailure": "handleFailure",
        }
    ]
};

// Send message
const { sendMessage } = require('../src/utils/messaging');
sendMessage("workflow", { value: workflowDefinitionNew });

// cURL command:
console.log(`
curl -X POST http://localhost:5000/workflow/create \\
-H "Content-Type: application/json" \\
-d '{
    "name": "new",
    "steps": [
        {
            "name": "step1",
            "type": "ACTION",
            "task": "JOB_SCHEDULE_CREATE",
            "parameters": { "url": "${process.env.API_URL}", "method": "GET" },
            "onSuccess": "step2",
            "onFailure": "handleFailure",
        },
        {
            "name": "step2",
            "type": "ACTION",
            "task": "DATA_COLLECT_REQUEST",
            "parameters": { "url": "${process.env.API_URL}", "method": "GET" },
            "onSuccess": null,
            "onFailure": "handleFailure",
        }
    ]
}'`);
