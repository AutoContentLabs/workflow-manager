// src\orchestrator\stateManager.js
const logger = require('../utils/logger');

class StateManager {
    constructor(workflow) {
        this.workflow = workflow;
        this.currentStepIndex = 0;
        this.state = 'IDLE'; // Options: IDLE, RUNNING, COMPLETED, FAILED
    }
    
    async updateStepStatus(step) {
        const stepIndex = this.workflow.steps.findIndex(s => s._id.equals(step._id));
        if (stepIndex !== -1) {
            this.workflow.steps[stepIndex].status = step.status;
            this.workflow.steps[stepIndex].startedAt = step.startedAt || this.workflow.steps[stepIndex].startedAt;
            this.workflow.steps[stepIndex].completedAt = step.completedAt || this.workflow.steps[stepIndex].completedAt;
            await this.workflow.save(); // Veritabanına kaydet
        }
    }
    
    
    async updateWorkflowState(newState) {
        this.state = newState;
        this.workflow.state = newState;
    
        if (newState === 'COMPLETED' || newState === 'FAILED') {
            this.workflow.completedAt = new Date(); // Tamamlama zamanı
        }
    
        await this.workflow.save(); // MongoDB'ye kaydet
        logger.info(`Workflow state updated to: ${newState}`);
    }
    

    getCurrentStep() {
        return this.workflow.steps[this.currentStepIndex];
    }

    async moveToNextStep() {
        const currentStep = this.getCurrentStep();
        if (this.state === 'FAILED') {
            return; // Eğer durumda failure varsa, bir sonraki adıma geçme
        }

        if (currentStep.onSuccess) {
            const nextStep = this.workflow.steps.find(step => step.name === currentStep.onSuccess);
            if (nextStep) {
                this.currentStepIndex = this.workflow.steps.indexOf(nextStep);
            }
        } else {
            await this.updateWorkflowState('COMPLETED'); // Son adımda başarı durumuna geçiş
        }
    }

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
                await this.updateWorkflowState('FAILED'); // Hata durumuna geçiş
            }
        } else {
            await this.updateWorkflowState('FAILED'); // Eğer failure adımı yoksa FAILED olarak işaretle
        }
    }
}

module.exports = StateManager;
