#!/bin/bash
# startWorkflowCurl.sh
# Example of starting a workflow with the cURL command.

WORKFLOW_ID="6752fa84664a538e31ce5410"  # Workflow ID is defined here

curl -X POST http://localhost:5000/workflow/$WORKFLOW_ID/start \
-H "Content-Type: application/json" \
-d '{}'
