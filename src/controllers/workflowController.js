/**
 * @file src/controllers/workflowController.js
 */
const Workflow = require('../models/workflowModel');
const WorkflowEngine = require('../orchestrator/workflowEngine');
const logger = require('../utils/logger');

// Create a new workflow and save it to the database
async function createWorkflow(req, res) {
    try {
        const { name, steps } = req.body;

        // Check if the workflow with the same name already exists
        const existingWorkflow = await Workflow.findOne({ name });
        if (existingWorkflow) {
            return res.status(400).json({ message: `Workflow with the name '${name}' already exists.` });
        }

        // Create and save new workflow
        const workflow = new Workflow({ name, steps });
        await workflow.save();

        logger.info(`Workflow '${name}' created successfully.`);
        res.status(201).json({ message: 'Workflow created successfully.', workflow });
    } catch (error) {
        logger.error(`Error creating workflow: ${error.message}`);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

// Start the workflow by ID and run its steps
async function startWorkflow(req, res) {
    try {
        const workflowId = req.params.id;

        // Find the workflow by ID
        const workflow = await Workflow.findById(workflowId);
        if (!workflow) {
            return res.status(404).json({ message: 'Workflow not found.' });
        }

        // Start the workflow using the engine
        const engine = new WorkflowEngine(workflow);
        await engine.run();

        logger.info(`Workflow '${workflow.name}' started successfully.`);
        res.json({ message: 'Workflow started successfully.' });
    } catch (error) {
        logger.error(`Error starting workflow: ${error.message}`);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

// Listener to start workflow from an external message (e.g., webhook, event)
async function startWorkflowListener({ value }) {
    const { steps, name, id } = value; // Extract necessary data from the message
    try {
        let workflow;

        if (id) {
            // If ID is provided, find the workflow by ID
            workflow = await Workflow.findById(id);
            if (!workflow) {
                logger.error(`Workflow with ID ${id} not found.`);
                return;
            }
            logger.info(`Workflow with ID ${id} found.`);
        } else if (name && steps) {
            // If name and steps are provided, create a new workflow
            workflow = await Workflow.findOne({ name });
            if (!workflow) {
                workflow = new Workflow({ name, steps });
                await workflow.save();
                logger.info(`New workflow '${name}' created successfully.`);
            } else {
                logger.info(`Workflow '${name}' already exists.`);
            }
        } else {
            logger.error('Received incomplete or invalid workflow data.');
            return;
        }

        // Run the workflow using the engine
        const engine = new WorkflowEngine(workflow);
        await engine.run();

        logger.info(`Workflow '${workflow.name}' completed successfully.`);
    } catch (error) {
        logger.error(`Error running workflow: ${error.message}`);
    }
}

module.exports = { startWorkflow, createWorkflow, startWorkflowListener };
