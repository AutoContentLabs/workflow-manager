/**
 * @file src/orchestrator/taskExecutor.js
 */
const logger = require('../utils/logger'); // Ensure logger is correctly imported
const taskRegistry = require('./TaskRegistry');

class TaskExecutor {
    static async execute(taskName, step) {
        try {
            step.startedAt = new Date();
            // Set the step status as RUNNING when it's being executed
            step.status = 'RUNNING';

            // Log the task execution start
            logger.info(`Executing task ${taskName} for step ${step.name}`);

            // Execute the task using the TaskRegistry
            const result = await taskRegistry.execute(step.type, taskName, step);

            // On successful task completion, set the step status to SUCCESS
            step.completedAt = new Date();
            step.status = 'SUCCESS';

            logger.info(`Task ${taskName} executed successfully for step ${step.name}`);
            return result;

        } catch (error) {
            // Log the error
            logger.error(`Error executing task ${taskName}: ${error.message}`);

            // On failure, set the step status to FAILED
            step.status = 'FAILED';
            step.completedAt = new Date();

            // Save the step status if necessary (e.g., to the database)
            await step.save();

            // Rethrow the error after handling
            throw error;
        }
    }
}

module.exports = TaskExecutor;
