/**
 * @file src/models/workflowModel.js
 */
const mongoose = require('mongoose');

// Step schema to define each step in the workflow
const stepSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the step
    type: { 
        type: String, 
        required: true, 
        enum: ['ACTION', 'DECISION', 'WAIT'], // Enum to restrict step types
        default: 'ACTION' 
    },
    task: { type: String, required: true }, // Task that the step performs
    onSuccess: { type: String, required: false }, // Optional task on success
    onFailure: { type: String, required: false }, // Optional task on failure
    parameters: { type: mongoose.Schema.Types.Mixed, required: false }, // Parameters for flexibility
    status: { 
        type: String, 
        enum: ['PENDING', 'SUCCESS', 'FAILED'], 
        default: 'PENDING' 
    }, // Status of the step
    startedAt: { type: Date, default: null }, // Timestamp when the step started
    completedAt: { type: Date, default: null } // Timestamp when the step completed
});

// Workflow schema to define the overall workflow structure
const workflowSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Workflow name, should be unique
    steps: { type: [stepSchema], required: true }, // Steps array, should not be empty
    startedAt: { type: Date, default: null }, // Workflow start timestamp
    completedAt: { type: Date, default: null }, // Workflow end timestamp
    state: { 
        type: String, 
        enum: ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED'], 
        default: 'PENDING' 
    } // Overall workflow state
});

// Create a model for the Workflow
const Workflow = mongoose.model('Workflow', workflowSchema);

module.exports = Workflow;
