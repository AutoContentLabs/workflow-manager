// src\models\workflowModel.js
const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
    name: String,
    type: String,
    task: String,
    onFailure: String
});

const workflowSchema = new mongoose.Schema({
    name: String,
    steps: [stepSchema]
});

const Workflow = mongoose.model('Workflow', workflowSchema);

module.exports = Workflow;
