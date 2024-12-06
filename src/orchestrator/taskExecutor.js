// src\orchestrator\taskExecutor.js
const taskRegistry = require('./TaskRegistry');

class TaskExecutor {
    static async execute(taskName, step) {
        step.startedAt = new Date(); // Başlangıç zamanı
        await step.save(); // Veritabanına kaydet
    
        const result = await taskRegistry.execute(step.type, taskName, step);
        
        step.completedAt = new Date(); // Tamamlanma zamanı
        return result;
    }
    
}

module.exports = TaskExecutor;