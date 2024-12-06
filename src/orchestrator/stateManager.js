// src\orchestrator\stateManager.js
class StateManager {
    constructor(workflow) {
        this.workflow = workflow;
        this.currentStepIndex = 0;
        this.state = 'IDLE'; // Options: IDLE, RUNNING, COMPLETED, FAILED
    }

    getCurrentStep() {
        return this.workflow.steps[this.currentStepIndex];
    }

    moveToNextStep() {
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
            this.state = 'COMPLETED'; // Son adımda başarı durumuna geçiş
        }
    }
    

    handleFailure() {
        const currentStep = this.getCurrentStep();
        // Eğer zaten failure adımı çalışmışsa, sonlandır
        if (this.state === 'FAILED') {
            logger.info('Failure already handled, skipping failure step.');
            return;
        }
        if (currentStep.onFailure) {
            const failureStep = this.workflow.steps.find(step => step.name === currentStep.onFailure);
            if (failureStep) {
                this.currentStepIndex = this.workflow.steps.indexOf(failureStep);
                this.state = 'FAILED'; // Hata yönetimi adımına geçtikten sonra durumu FAILED olarak işaretle
            }
        } else {
            this.state = 'FAILED'; // Eğer failure adımı yoksa, workflow'u FAILED olarak işaretle
        }
    }
    

    markFailed() {
        this.state = 'FAILED';
    }
}

module.exports = StateManager;
