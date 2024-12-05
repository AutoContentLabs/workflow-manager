const workflowDefinition = {
    "id": 1,
    "name": "default",
    "steps": [
        {
            "task": "collectData",
            "onFailure": "handleFailure"
        },
        {
            "task": "createContent"
        }
    ]
};

const { sendMessage } = require('./src/config/messaging');

sendMessage("workflow", { value: workflowDefinition });
sendMessage("workflow", { value: { "id": workflowDefinition.id } });
// curl -X POST http://localhost:5000/workflow/{WORKFLOW_ID}/start
