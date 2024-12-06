/**
 * @file src/orchestrator/stateManager.js
 */
const logger = require('../utils/logger');

class StateManager {
    constructor(workflow) {
        this.workflow = workflow;
        this.currentStepIndex = 0;
        this.state = 'IDLE'; // Options: IDLE, RUNNING, COMPLETED, FAILED
    }

    // Check if the entire workflow is completed
    isWorkflowCompleted() {
        return this.workflow.steps.every(step => step.status === 'SUCCESS');
    }

    // Update the status of a specific step in the workflow
    async updateStepStatus(step) {
        const stepIndex = this.workflow.steps.findIndex(s => s._id.equals(step._id));
        if (stepIndex !== -1) {
            this.workflow.steps[stepIndex].status = step.status;
            this.workflow.steps[stepIndex].startedAt = step.startedAt || this.workflow.steps[stepIndex].startedAt;
            this.workflow.steps[stepIndex].completedAt = step.completedAt || this.workflow.steps[stepIndex].completedAt;
            await this.workflow.save(); // Save the updated workflow to the database
        }
    }

    // Get the next step by name
    getNextStep(stepName) {
        return this.workflow.steps.find(step => step.name === stepName);
    }

    // Update the overall workflow state (e.g., RUNNING, COMPLETED, FAILED)
    async updateWorkflowState(newState) {
        if (this.isWorkflowCompleted()) {
            this.workflow.state = 'COMPLETED';
            this.workflow.completedAt = new Date();
        } else {
            this.workflow.state = newState;
            if (newState === 'FAILED') {
                this.workflow.completedAt = new Date();
            }
        }
    
        await this.workflow.save(); // Save the updated state to the database
        logger.info(`Workflow state updated to: ${this.workflow.state}`);
    }

    // Get the current step in the workflow
    getCurrentStep() {
        return this.workflow.steps[this.currentStepIndex];
    }

    // Move to the next step based on the success/failure criteria
    async moveToNextStep() {
        const currentStep = this.getCurrentStep();
        if (this.state === 'FAILED') {
            return; // Don't move to the next step if the workflow is in a failure state
        }

        if (currentStep.onSuccess) {
            const nextStep = this.workflow.steps.find(step => step.name === currentStep.onSuccess);
            if (nextStep) {
                this.currentStepIndex = this.workflow.steps.indexOf(nextStep);
            } else {
                logger.error(`Next step for '${currentStep.name}' does not exist.`);
            }
        } else {
            await this.updateWorkflowState('COMPLETED'); // If no next step, mark the workflow as completed
        }
    }

    // Handle the failure scenario (move to failure step or mark as failed)
    async handleFailure() {
        const currentStep = this.getCurrentStep();
        if (this.state === 'FAILED') {
            logger.info('Failure already handled, skipping failure step.');
            return;
        }

        if (currentStep.onFailure) {
            const failureStep = this.workflow.steps.find(step => step.name === currentStep.onFailure);
            if (failureStep) {
                this.currentStepIndex = this.workflow.steps.indexOf(failureStep);
                await this.updateWorkflowState('FAILED'); // Mark the workflow as failed
            } else {
                logger.error(`Failure step for '${currentStep.name}' does not exist.`);
                await this.updateWorkflowState('FAILED'); // If no failure step, directly mark as failed
            }
        } else {
            await this.updateWorkflowState('FAILED'); // If no failure step is defined, mark as failed
        }
    }
}

module.exports = StateManager;
