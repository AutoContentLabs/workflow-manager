/**
 * @file src/initialize.js
 */
const workflows = require('./workflows');
const Workflow = require('./models/workflowModel');
const logger = require("./utils/logger");

async function initializeDefaultWorkflows() {
    try {
        // Optionally skip initialization in production environment
        if (process.env.NODE_ENV === 'production') {
            logger.info("Skipping workflow initialization in production.");
            return;
        }

        // Parallel workflow creation with upsert for efficiency
        const promises = workflows.map(async (workflow) => {
            try {
                // Upsert operation ensures that if the workflow exists, it's updated, otherwise created
                await Workflow.updateOne({ name: workflow.name }, workflow, { upsert: true });
                logger.info(`Workflow ${workflow.name} initialized or updated successfully.`);
            } catch (error) {
                logger.error(`Error initializing or updating workflow ${workflow.name}:`, error);
            }
        });

        // Wait for all promises to resolve
        await Promise.all(promises);
    } catch (error) {
        logger.error("Error initializing default workflows:", error);
    }
}

initializeDefaultWorkflows();
