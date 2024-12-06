// src\config\createdb.js
// mongo db creattor ui
const database = 'WORKFLOW_MANAGER';
const collection = 'workflows';

// Create a new database.
use(database);

// Create a new collection.
db.createCollection(collection);


// Create a new document in the collection.
db.getCollection(collection).insertOne({
    "name": "auto-content",
    "steps": [
        {
            "name": "step1",
            "type": "action",
            "task": "JOB_SCHEDULE_CREATE",
            "parameters": { "url": "http://example.com", "method": "GET" },
            "onSuccess": "step2",
            "onFailure": "handleFailure",
        },
        {
            "name": "step2",
            "type": "action",
            "task": "DATA_COLLECT_REQUEST",
            "parameters": { "url": "http://example.com", "method": "GET" },
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
            "type": "action",
            "task": "DATA_PROCESSING_START",
            "onSuccess": "step5",
            "onFailure": "handleFailure",
            "parameters": {}
        },
        {
            "name": "step5",
            "type": "action",
            "task": "DATA_PROCESSING_RESULT",
            "onSuccess": null,
            "onFailure": "handleFailure",
            "parameters": {}
        },
        {
            "name": "step6",
            "type": "action",
            "task": "DATA_STORAGE",
            "onSuccess": "step7",
            "onFailure": "handleFailure",
            "parameters": {}
        },
        {
            "name": "step7",
            "type": "action",
            "task": "DATA_AGGREGATION",
            "onSuccess": "step8",
            "onFailure": "handleFailure",
            "parameters": {}
        },
        {
            "name": "step8",
            "type": "action",
            "task": "ANALYSIS_REQUEST",
            "onSuccess": "step9",
            "onFailure": "handleFailure",
            "parameters": {}
        },
        {
            "name": "step9",
            "type": "action",
            "task": "ANALYSIS_RESULT",
            "onSuccess": "step10",
            "onFailure": "handleFailure",
            "parameters": {}
        },
        {
            "name": "step10",
            "type": "action",
            "task": "REPORT",
            "onSuccess": "step11",
            "onFailure": "handleFailure",
            "parameters": {}
        },
        {
            "name": "step11",
            "type": "action",
            "task": "NOTIFICATION",
            "onSuccess": null,
            "onFailure": "handleFailure",
            "parameters": {}
        },

    ]
});
