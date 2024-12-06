/**
 * @file src/orchestrator/workflowEngine.js
 */
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
        await this.stateManager.updateWorkflowState('RUNNING');

        // Iterate over each step in the workflow
        for (const step of this.stateManager.workflow.steps) {
            if (step.status !== 'PENDING') {
                logger.info(`Skipping step: ${step.name} (Status: ${step.status})`);
                continue; // Skip steps that are not 'PENDING'
            }

            try {
                // Execute the step task
                logger.info(`Executing step: ${step.name}`);
                await TaskExecutor.execute(step.task, step);

                // Update step status to 'SUCCESS' after successful execution
                step.status = 'SUCCESS';
                step.completedAt = new Date();
                await this.stateManager.updateStepStatus(step);

                // If there's a success handler, move to the next step
                if (step.onSuccess) {
                    const nextStep = this.stateManager.getNextStep(step.onSuccess);
                    if (nextStep) {
                        logger.info(`Moving to next step: ${nextStep.name}`);
                        continue;
                    }
                }
            } catch (error) {
                // If step execution fails, handle failure
                logger.error(`Error executing step: ${step.name}`, error);

                // Update step status to 'FAILED'
                step.status = 'FAILED';
                step.completedAt = new Date();
                await this.stateManager.updateStepStatus(step);

                // If there's a failure handler, execute failure steps
                if (step.onFailure) {
                    logger.info(`Executing failure handler for step: ${step.onFailure}`);
                    const failureStep = this.stateManager.getNextStep(step.onFailure);
                    if (failureStep) {
                        continue; // If a failure step exists, skip to that step
                    }
                }

                // If no failure step, mark the entire workflow as failed
                await this.stateManager.updateWorkflowState('FAILED');
                return; // Exit the workflow if it fails
            }
        }

        // All steps were successfully executed, mark workflow as completed
        await this.stateManager.updateWorkflowState('COMPLETED');
        logger.info(`Workflow ${this.stateManager.workflow.name} completed successfully.`);
    }
}

module.exports = WorkflowEngine;
