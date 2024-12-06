const workflows = require('./workflows');
const Workflow = require('./models/workflowModel');
const logger = require("./utils/logger")
async function initializeDefaultWorkflows() {
    try {
        for (const workflow of workflows) {
            const exists = await Workflow.findOne({ name: workflow.name });
            if (!exists) {
                await Workflow.create(workflow);
            }
        }
        logger.info("Default workflows initialized successfully.");
    } catch (error) {
        logger.error("Error initializing default workflows:", error);
    }
}

initializeDefaultWorkflows();
