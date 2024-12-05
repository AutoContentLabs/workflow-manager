// src\workflows\defaultWorkflow.js
module.exports = {
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

