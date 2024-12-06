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
            this.stateManager.workflow.startedAt = new Date();
            await this.stateManager.workflow.save();
        }
        logger.info(`Starting workflow: ${this.stateManager.workflow.name}`);
        this.stateManager.state = 'RUNNING';

        for (const step of this.stateManager.workflow.steps) {
            if (step.status !== 'PENDING') continue;

            try {
                await TaskExecutor.execute(step.task, step);

                step.status = 'SUCCESS';
                step.completedAt = new Date();
                await this.stateManager.updateStepStatus(step);

                if (step.onSuccess) {
                    const nextStep = this.stateManager.getNextStep(step.onSuccess);
                    if (nextStep) {
                        logger.info(`Moving to next step: ${nextStep.name}`);
                        continue;
                    }
                }
                break;
            } catch (error) {
                logger.error(`Error executing step: ${step.name}`, error);

                step.status = 'FAILED';
                step.completedAt = new Date();
                await this.stateManager.updateStepStatus(step);

                if (step.onFailure) {
                    logger.info(`Executing failure step: ${step.onFailure}`);
                    const failureStep = this.stateManager.getNextStep(step.onFailure);
                    if (failureStep) continue;
                }

                this.stateManager.updateWorkflowState('FAILED');
                break;
            }
        }

        this.stateManager.updateWorkflowState('COMPLETED');
    }

}

module.exports = WorkflowEngine;
