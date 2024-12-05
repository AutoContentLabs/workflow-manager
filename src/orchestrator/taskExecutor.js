// src\orchestrator\taskExecutor.js
const { sendMessage } = require('../utils/messaging');
const logger = require('../utils/logger');

class TaskExecutor {
    static async execute(taskName, params) {
        try {
            logger.info(`Executing task: ${taskName}`);
            const result = await sendMessage(taskName, { value: params });
            logger.info(`Task completed: ${taskName}`);
            return result;
        } catch (error) {
            logger.error(`Task failed: ${taskName} - ${error.message}`);
            throw error;
        }
    }
}

module.exports = TaskExecutor;
