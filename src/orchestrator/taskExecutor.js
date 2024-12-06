// src\orchestrator\taskExecutor.js
const taskRegistry = require('./TaskRegistry');

class TaskExecutor {
    static async execute(taskName, step) {
        try {
            step.startedAt = new Date();
            const result = await taskRegistry.execute(step.type, taskName, step);

            step.completedAt = new Date();
            return result;
        } catch (error) {
            logger.error(`Error executing task ${taskName}: ${error.message}`);
            throw error;
        }
    }
}

module.exports = TaskExecutor;