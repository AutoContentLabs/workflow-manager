/**
 * @file src/utils/logger.js
 */
const { logger: baseLogger } = require('@auto-content-labs/messaging-utils');

// Enhancing logger for more control and structure
const logger = baseLogger.child({ service: 'workflow-engine' }); // Add custom context for the service

// Adding custom log levels and additional functionality
logger.level = process.env.LOG_LEVEL || 'info'; // Set default level if not defined in environment

// Example of adding a custom method to log workflow-specific information
logger.workflowInfo = (workflowId, message) => {
    logger.info(`[Workflow: ${workflowId}] ${message}`);
};

logger.workflowError = (workflowId, message) => {
    logger.error(`[Workflow: ${workflowId}] ${message}`);
};

module.exports = logger;
