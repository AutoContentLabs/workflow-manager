// src\workflows\defaultWorkflow.js
module.exports = {
    "id": "67521253c468528a37b913dc",
    "name": "default",
    "steps": [
        {
            "name": "step1",
            "type": "action",
            "task": "collectData",
            "parameters": { "url": "http://example.com", "method": "GET" },
            "onSuccess": "step2",
            "onFailure": "handleFailure",
        },
        {
            "name": "step2",
            "type": "delay",
            "task": "waitData",
            "parameters": { "duration": 5000 },
            "onSuccess": "step3",
            "onFailure": "step5",
        },
        {
            "name": "step3",
            "type": "action",
            "task": "validateData",
            "onSuccess": "step4",
            "onFailure": "handleFailure",
            "parameters": {}
        },
        {
            "name": "step4",
            "type": "action",
            "task": "finalizeData",
            "onSuccess": null,
            "onFailure": "handleFailure",
            "parameters": {}
        }
    ]
};

