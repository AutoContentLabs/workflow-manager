/**
 * @file src/workflows/index.js
 */
const fs = require('fs');
const path = require('path');

const workflowsDirectory = path.join(__dirname);
const workflowFiles = fs.readdirSync(workflowsDirectory).filter(file => file.endsWith('Workflow.js'));

const workflows = workflowFiles.map(file => {
    const workflow = require(path.join(workflowsDirectory, file));

    // Simple validation to ensure required properties are present
    if (!workflow.name || !workflow.steps || !Array.isArray(workflow.steps)) {
        throw new Error(`Invalid workflow definition in ${file}`);
    }

    return workflow;
});

module.exports = workflows;
