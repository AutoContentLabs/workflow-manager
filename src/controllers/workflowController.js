// src\controllers\workflowController.js
const Workflow = require('../models/workflowModel');
const WorkflowEngine = require('../orchestrator/workflowEngine');
const logger = require('../utils/logger');

async function createWorkflow(req, res) {
    try {
        const { name, steps } = req.body;

        const workflow = new Workflow({ name, steps });
        await workflow.save();

        res.status(201).json({ message: 'Workflow created successfully.', workflow });
    } catch (error) {
        logger.error(`Error creating workflow: ${error.message}`);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

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
    const { id } = value;

    try {
        const workflow = await Workflow.findById(id);
        if (!workflow) {
            logger.error(`Workflow with ID ${id} not found.`);
            return;
        }
        const engine = new WorkflowEngine(workflow);
        await engine.run();

        logger.info(`Workflow ${workflow.name} completed successfully.`);
    } catch (error) {
        logger.error(`Error executing workflow: ${error.message}`);
    }

}

module.exports = { startWorkflow, createWorkflow, startWorkflowListener };