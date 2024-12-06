const workflowDefinition = {
    "id": "67521253c468528a37b913dc",
    "name": "default",
    "steps": [
        {
            "name": "step1",
            "type": "action",
            "task": "collectData",
            "parameters": { "url": "http://example.com", "method": "GET" },
            "onSuccess": "step5",
            "onFailure": "step5",
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
            "onFailure": "step5",
            "parameters": {}
        },
        {
            "name": "step4",
            "type": "action",
            "task": "finalizeData",
            "onSuccess": null,
            "onFailure": "step5",
            "parameters": {}
        },
        {
            "name": "step5",
            "type": "action",
            "task": "handleFailure",
            "onSuccess": null,
            "onFailure": null,
            "parameters": {}
        }
    ]
};
const workflowDefinitionNew = {
    "name": "dataCollection",
    "steps": [
        {
            "name": "step1",
            "type": "action",
            "task": "handleFailure",
            "onSuccess": null,
            "onFailure": null,
            "parameters": {}
        }
    ]
}

const { sendMessage } = require('../src/utils/messaging');

// sendMessage("workflow", { value: { "id": workflowDefinition.id } });
// sendMessage("workflow", { value: workflowDefinition });
sendMessage("workflow", { value: workflowDefinitionNew });
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

