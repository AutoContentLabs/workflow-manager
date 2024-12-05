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
        if (this.currentStepIndex < this.workflow.steps.length - 1) {
            this.currentStepIndex++;
            return true;
        }
        this.state = 'COMPLETED';
        return false;
    }

    markFailed() {
        this.state = 'FAILED';
    }
}

module.exports = StateManager;
