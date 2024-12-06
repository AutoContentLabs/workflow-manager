/**
 * @file src/utils/messaging.js
 */
const { sendMessage, listenMessage } = require('@auto-content-labs/messaging');
const { helper } = require('@auto-content-labs/messaging-utils');
const logger = require('../utils/logger');  // Assuming logger is configured as previously discussed

// Send Message Function with Error Handling and Logging
async function send(event, providedPair) {
    const headers = helper.generateHeaders(event);
    const key = helper.generateKey();
    const pair = {
        value: providedPair.value,
        key,
        headers
    };

    try {
        logger.info(`Sending message for event: ${event} with key: ${JSON.stringify(key)}`);
        const response = await sendMessage(event, pair);

        // Logging success
        logger.info(`Message sent successfully for event: ${event}, key: ${JSON.stringify(key)}`);

        return response;
    } catch (error) {
        // Logging error with detailed message
        logger.error(`Error sending message for event: ${event} with key: ${key}: ${error.message}`);
        throw new Error(`Failed to send message for event: ${event}`);
    }
}

module.exports = {
    sendMessage: send,
    listenMessage,
};
