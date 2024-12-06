// src\models\workflowModel.js
const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
    name: String,
    type: String,
    task: String,
    onSuccess: { type: String, required: false },
    onFailure: { type: String, required: false },
    parameters: { type: mongoose.Schema.Types.Mixed, required: false }, // Parametreler için esnek yapı
    status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' }, // Durum ekleniyor
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null }
});

const workflowSchema = new mongoose.Schema({
    name: String,
    steps: [stepSchema],
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    state: { type: String, enum: ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED'], default: 'PENDING' } // Genel durum
});

const Workflow = mongoose.model('Workflow', workflowSchema);

module.exports = Workflow;
