/**
 * @file src/models/workflowModel.js
 */
const mongoose = require('mongoose');

// Event schema to define each event in the workflow (similar to a step)
const eventSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Event name
    description: { type: String, required: true }, // Event description
    type: { 
        type: String, 
        required: true, 
        enum: ['TASK', 'SERVICE', 'FUNCTION', 'WORKFLOW', 'ACTION'], // Event type
        default: 'TASK' 
    },
    dependencies: [{ type: String }], // List of dependent events (other event names)
    on_start: [{ 
        type: { type: String, required: true, enum: ['service', 'config', 'script', 'task'] },
        name: { type: String, required: true },
        parameters: { type: mongoose.Schema.Types.Mixed },
        input: { type: mongoose.Schema.Types.Mixed },
        output: { type: mongoose.Schema.Types.Mixed },
        timestamp: { type: Date, default: Date.now }
    }], // Tasks to run on start
    on_success: [{ 
        type: { type: String, required: true, enum: ['status', 'step'] },
        name: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }], // Actions to execute on success
    on_failure: [{ 
        type: { type: String, required: true, enum: ['function', 'rollback'] },
        name: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }], // Actions to execute on failure
    status: { 
        type: String, 
        enum: ['PENDING', 'RUNNING', 'SUCCESS', 'FAILED'], 
        default: 'PENDING' 
    }, // Status of the event
    startedAt: { type: Date, default: null }, // Timestamp when the event started
    completedAt: { type: Date, default: null } // Timestamp when the event completed
});

// Workflow schema to define the entire workflow (like a DAG)
const workflowSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Workflow name (unique constraint)
    description: { type: String, required: true }, // Workflow description
    type: { 
        type: String, 
        required: true, 
        enum: ['PIPELINE', 'DAG', 'LINEAR'], 
        default: 'DAG' 
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
        type: { type: String, required: true, enum: ['config', 'service', 'task'] },
        name: { type: String, required: true },
        parameters: { type: mongoose.Schema.Types.Mixed },
        timestamp: { type: Date, default: Date.now }
    }], // Workflow-level start triggers
    on_success: [{ 
        type: { type: String, required: true, enum: ['status', 'action'] },
        name: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }], // Workflow-level success triggers
    on_failure: [{ 
        type: { type: String, required: true, enum: ['function', 'rollback'] },
        name: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }], // Workflow-level failure triggers
    steps: [eventSchema], // List of events (steps) in the workflow
    startedAt: { type: Date, default: null }, // Timestamp when the workflow started
    completedAt: { type: Date, default: null } // Timestamp when the workflow completed
});

// Create a model for the Workflow
const Workflow = mongoose.model('Workflow', workflowSchema);

module.exports = Workflow;
