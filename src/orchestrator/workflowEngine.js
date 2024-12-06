// src\orchestrator\workflowEngine.js
const StateManager = require('./stateManager');
const TaskExecutor = require('./taskExecutor');
const logger = require('../utils/logger');

class WorkflowEngine {
    constructor(workflow) {
        this.stateManager = new StateManager(workflow);
    }

    async run() {
        logger.info(`Starting workflow: ${this.stateManager.workflow.name}`);
        this.stateManager.state = 'RUNNING';

        while (this.stateManager.state === 'RUNNING') {
            const step = this.stateManager.getCurrentStep();
            try {
                await TaskExecutor.execute(step.task, step);

                // Adım başarıyla tamamlandıysa durumu güncelle
                step.status = 'SUCCESS';
                await this.stateManager.updateStepStatus(step);

                this.stateManager.moveToNextStep(); // Move to next step based on success
            } catch (error) {
                logger.error(`Error in step: ${step.task}`);

                step.status = 'FAILED'; // Adım başarısız olduysa durumu güncelle
                await this.stateManager.updateStepStatus(step);

                if (step.onFailure) {
                    logger.info(`Redirecting to failure task: ${step.onFailure}`);
                    await TaskExecutor.execute(step.onFailure, step);
                    this.stateManager.handleFailure(); // Move to failure step
                } else {
                    this.stateManager.markFailed(); // If no failure task is defined
                }
            }
        }

        logger.info(`Workflow completed with state: ${this.stateManager.state}`);
    }

}

module.exports = WorkflowEngine;
