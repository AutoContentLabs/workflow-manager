// src\orchestrator\taskExecutor.js
const taskRegistry = require('./TaskRegistry');

class TaskExecutor {
    static async execute(taskName, step) {
        return await taskRegistry.execute(step.type, taskName, step);
    }
}

module.exports = TaskExecutor;