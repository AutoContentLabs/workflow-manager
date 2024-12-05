// src\controllers\workflowController.js
const Workflow = require('../models/workflowModel');
const workflows = require("../workflows")
const WorkflowEngine = require('../orchestrator/workflowEngine');
const logger = require('../utils/logger');

async function startWorkflow(req, res) {
    try {
        const workflowId = req.params.id;
        const workflow = await Workflow.findById(workflowId);

        if (!workflow) {
            return res.status(404).json({ message: 'Workflow not found.' });
        }

        const engine = new WorkflowEngine(workflow);
        await engine.run();

        res.json({ message: 'Workflow started successfully.' });
    } catch (error) {
        logger.error(`Error starting workflow: ${error.message}`);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

async function startWorkflowListener({ value }) {
    const { type, id, name, steps } = value;
    if (type === 'start') {
        try {

            const result = await workflowEngine.startWorkflow(id);
            logger.info(`Workflow ${name} completed successfully. ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`Error executing workflow: ${error.message}`);
        }
    }
}

module.exports = { startWorkflow, startWorkflowListener };