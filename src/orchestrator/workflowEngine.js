// src\orchestrator\workflowEngine.js
const StateManager = require('./stateManager');
const TaskExecutor = require('./taskExecutor');
const logger = require('../utils/logger');

class WorkflowEngine {
    constructor(workflow) {
        this.stateManager = new StateManager(workflow);
    }

    async run() {
        if (!this.stateManager.workflow.startedAt) {
            this.stateManager.workflow.startedAt = new Date(); // Workflow başlangıç zamanı
            await this.stateManager.workflow.save();
        }
        logger.info(`Starting workflow: ${this.stateManager.workflow.name}`);
        this.stateManager.state = 'RUNNING';

        while (this.stateManager.state === 'RUNNING') {
            const step = this.stateManager.getCurrentStep();
            try {
                await TaskExecutor.execute(step.task, step);

                step.status = 'SUCCESS'; // Adım başarıyla tamamlandı
                step.completedAt = new Date(); // Tamamlanma zamanı
                await this.stateManager.updateStepStatus(step);

                await this.stateManager.moveToNextStep(); // Sonraki adıma geçiş
            } catch (error) {
                logger.error(`Error in step: ${step.task}`);
                step.status = 'FAILED'; // Adım başarısız oldu
                step.completedAt = new Date(); // Tamamlanma zamanı
                await this.stateManager.updateStepStatus(step);

                if (step.onFailure) {
                    logger.info(`Executing failure task: ${step.onFailure}`);
                    await TaskExecutor.execute(step.onFailure, step);
                    await this.stateManager.handleFailure();
                } else {
                    await this.stateManager.updateWorkflowState('FAILED'); // Workflow başarısız
                }
            }
        }

        this.stateManager.workflow.completedAt = new Date(); // Workflow tamamlandı
        await this.stateManager.workflow.save();
        logger.info(`Workflow completed with state: ${this.stateManager.state}`);
    }
}

module.exports = WorkflowEngine;
