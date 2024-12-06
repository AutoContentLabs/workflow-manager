// src\config\messaging.js
const { sendMessage, listenMessage } = require('@auto-content-labs/messaging');
const { helper } = require('@auto-content-labs/messaging-utils');

// we just transport
async function send(event, providedPair) {
    const headers = helper.generateHeaders(event);
    const key = helper.generateKey();
    const pair = {
        value: providedPair.value,
        key,
        headers
    };
    return await sendMessage(event, pair)
}
module.exports = {
    sendMessage: send,
    listenMessage,
};
