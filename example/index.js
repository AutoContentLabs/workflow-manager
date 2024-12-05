const workflowDefinition = {
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

const { sendMessage } = require('../src/utils/messaging');

sendMessage("workflow", { value: workflowDefinition });
sendMessage("workflow", { value: { "id": workflowDefinition.id } });
// curl -X POST http://localhost:5000/workflow/{WORKFLOW_ID}/start
// curl -X POST http://localhost:5000/workflow/67521253c468528a37b913dc/start
// curl -X POST http://localhost:5000/workflow/create \
// -H "Content-Type: application/json" \
// -d '{    
//     "name": "new",
        // "steps": [
        //     {
        //         "name":"step1",
        //         "type": "action",
        //         "task": "collectData",
        //         "parameters": { "url": "http://example.com", "method": "GET" },
        //         "onFailure": "handleFailure"
        //     },
        //     {
        //         "name":"step2",
        //         "type": "delay",
        //         "task": "waitData",
        //         "parameters": { "duration": 5000 },
        //         "onFailure": "handleFailure"
        //     },
        // ]
// }'

