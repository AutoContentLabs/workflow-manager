const { sendMessage } = require("../utils/messaging");

class TaskRegistry {
    constructor() {
        this.tasks = {};
    }

    register(type, handler) {
        this.tasks[type] = handler;
    }

    async execute(type, taskName, step) {
        const handler = this.tasks[type];
        if (!handler) {
            throw new Error(`Handler for type "${type}" not found.`);
        }
        return handler(taskName, step);
    }
}

const taskRegistry = new TaskRegistry();

taskRegistry.register('action', async (taskName, step) => {
    let result;
    const cleanStep = JSON.parse(JSON.stringify(step));
    result = await sendMessage(taskName, { value: cleanStep });
    return result
});

taskRegistry.register('delay', async (taskName, step) => {
    return new Promise(resolve => setTimeout(resolve, step.parameters.duration));
});

module.exports = taskRegistry;
