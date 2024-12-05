const workflows = require('./workflows');
const Workflow = require('./models/workflowModel');

async function initializeDefaultWorkflows() {
    try {
        for (const workflow of workflows) {
            const exists = await Workflow.findOne({ name: workflow.name }); 
            if (!exists) {
                await Workflow.create(workflow);
            }
        }
        console.log("Default workflows initialized successfully.");
    } catch (error) {
        console.error("Error initializing default workflows:", error);
    }
}

initializeDefaultWorkflows();
