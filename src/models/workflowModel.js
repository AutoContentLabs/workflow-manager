/**
 * @file src/models/workflowModel.js
 */
const mongoose = require('mongoose');

const task = {
    name: { type: String, required: true, unique: true }, // Workflow name (unique constraint)
    description: { type: String, required: false }, // Workflow description
    type: {
        type: String,
        required: true,
        enum: ['PIPELINE', 'DAG', 'LINEAR', 'TASK', 'SERVICE', 'FUNCTION', 'WORKFLOW', 'ACTION'],
        default: 'TASK'
    }, // Type of workflow (DAG, Linear, Pipeline, etc.)
    state: {
        type: String,
        enum: ['IDLE', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'],
        default: 'IDLE'
    }, // Overall workflow state
    status: {
        type: String,
        enum: ['IDLE', 'RUNNING', 'COMPLETED', 'FAILED'],
        default: 'IDLE'
    }, // Current status of the workflow
    dependencies: [{ type: String }], // Global dependencies for the entire workflow
    on_start: [{
        type: { type: String, required: true, enum: ['config', 'service', 'task', 'script'] },
        name: { type: String, required: true },
        parameters: { type: mongoose.Schema.Types.Mixed },
        input: { type: mongoose.Schema.Types.Mixed },
        output: { type: mongoose.Schema.Types.Mixed },
        timestamp: { type: Date, default: null } // Timestamp when the workflow started
    }], // Workflow-level start triggers
    on_failure: [{
        type: { type: String, required: true, enum: ['function', 'rollback'] },
        name: { type: String, required: true },
        timestamp: { type: Date, default: null } // Timestamp when the workflow failure
    }], // Workflow-level failure triggers
    on_success: [{
        type: { type: String, required: true, enum: ['status', 'action', 'step'] },
        name: { type: String, required: true },
        timestamp: { type: Date, default: null } // Timestamp when the workflow completed
    }], // Workflow-level success triggers
}
// Task schema to define each event in the workflow (similar to a step)
const taskSchema = new mongoose.Schema({
    ...task
});


// Workflow schema 
const workflowSchema = new mongoose.Schema({
    ...task,
    steps: [taskSchema],
})

// Pipeline schema
const pipelineSchema = new mongoose.Schema({
    ...task,
    steps: [workflowSchema],
})

// Create a model for the Workflow
const Workflow = mongoose.model('Pipeline', pipelineSchema);

module.exports = Workflow;
