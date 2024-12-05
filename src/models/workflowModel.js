// src\models\workflowModel.js
const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
    name: String,
    steps: [
        {
            task: String,
            onFailure: String
        }
    ]
});

const Workflow = mongoose.model('Workflow', workflowSchema);

module.exports = Workflow;
