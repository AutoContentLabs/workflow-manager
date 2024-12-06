/**
 * @file src/orchestrator/TaskRegistry.js
 */
const { sendMessage } = require("../utils/messaging");
const logger = require("../utils/logger");  // Ensure logger is imported for logging

class TaskRegistry {
    constructor() {
        this.tasks = {}; // To store task handlers by type
    }

    // Registers a task handler for a specific type
    register(type, handler) {
        if (this.tasks[type]) {
            logger.warn(`Handler for task type "${type}" is already registered.`);
        } else {
            logger.info(`Handler for task type "${type}" registered successfully.`);
        }
        this.tasks[type] = handler;
    }

    // Executes the handler for the given task type
    async execute(type, taskName, step) {
        const handler = this.tasks[type];

        if (!handler) {
            logger.error(`Handler for task type "${type}" not found.`);
            throw new Error(`Handler for type "${type}" not found.`);
        }

        try {
            logger.info(`Executing task ${taskName} of type ${type}.`);
            const result = await handler(taskName, step);
            logger.info(`Task ${taskName} of type ${type} executed successfully.`);
            return result;
        } catch (error) {
            logger.error(`Error executing task ${taskName} of type ${type}: ${error.message}`);
            throw error; // Rethrow error after logging it
        }
    }
}

// Create an instance of TaskRegistry
const taskRegistry = new TaskRegistry();

// Register 'ACTION' task type
taskRegistry.register('ACTION', async (taskName, step) => {
    let result;
    const cleanStep = JSON.parse(JSON.stringify(step)); // Deep clone the step to avoid mutation
    try {
        // Example of sending a message (could be a call to external service or internal logic)
        result = await sendMessage(taskName, { value: cleanStep });
        logger.info(`Action completed: ${taskName}`);
    } catch (error) {
        logger.error(`Error in 'ACTION' task: ${error.message}`);
        throw error;
    }
    return result;
});

// Register 'DECISION' task type
taskRegistry.register('DECISION', async (taskName, step) => {
    const cleanStep = JSON.parse(JSON.stringify(step));
    try {
        // Example decision logic: check if a condition is met
        if (cleanStep.condition === 'SUCCESS') {
            logger.info(`Decision: Task ${taskName} passed, continuing workflow.`);
            return true; // Continue with the workflow
        } else {
            logger.info(`Decision: Task ${taskName} failed, halting workflow.`);
            return false; // Halt the workflow
        }
    } catch (error) {
        logger.error(`Error in 'DECISION' task: ${error.message}`);
        throw error;
    }
});

// Register 'WAIT' task type
taskRegistry.register('WAIT', async (taskName, step) => {
    const cleanStep = JSON.parse(JSON.stringify(step));
    try {
        // Wait for the specified duration (in milliseconds)
        const duration = cleanStep.parameters.duration || 1000; // Default to 1000ms if not specified
        logger.info(`Task ${taskName} is waiting for ${duration}ms.`);
        return new Promise(resolve => setTimeout(resolve, duration));
    } catch (error) {
        logger.error(`Error in 'WAIT' task: ${error.message}`);
        throw error;
    }
});

module.exports = taskRegistry;
