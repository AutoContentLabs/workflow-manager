#!/bin/bash
# createWorkflowCurl.sh
# Example of creating a new workflow with the cURL command.

curl -X POST http://localhost:5000/workflow/create \
-H "Content-Type: application/json" \
-d '{
    "name": "example_workflow",
    "steps": [
        {
            "name": "step1",
            "type": "ACTION",
            "task": "JOB_SCHEDULE_CREATE",
            "parameters": { "url": "https://example.com", "method": "GET" },
            "onSuccess": "step2",
            "onFailure": "handleFailure"
        },
        {
            "name": "step2",
            "type": "ACTION",
            "task": "DATA_COLLECT_REQUEST",
            "parameters": { "url": "https://example.com", "method": "GET" },
            "onSuccess": "step3",
            "onFailure": "handleFailure"
        }
    ]
}'
