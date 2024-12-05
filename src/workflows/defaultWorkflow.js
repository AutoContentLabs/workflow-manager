// src\workflows\defaultWorkflow.js
module.exports = {
    "id": "67521253c468528a37b913dc",
    "name": "default",
    "steps": [
        {
            "name":"step1",
            "type": "action",
            "task": "collectData",
            "parameters": { "url": "http://example.com", "method": "GET" },
            "onFailure": "handleFailure"
        },
        {
            "name":"step2",
            "type": "delay",
            "task": "waitData",
            "parameters": { "duration": 5000 },
            "onFailure": "handleFailure"
        },
    ]
};

