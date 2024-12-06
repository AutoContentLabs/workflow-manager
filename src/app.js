/**
 * @file src/app.js
 */
const express = require('express');
const connectDB = require('./config/database');
const { listenMessage } = require('./utils/messaging');
const workflowController = require('./controllers/workflowController');
const logger = require("./utils/logger");
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON and enabling CORS
app.use(express.json());
app.use(cors());

// Connect to the database
connectDB();
require("./initialize"); // Initialize workflows or dependencies

// Define routes
app.get('/workflow/list', workflowController.listWorkflows); // List all workflows
app.post('/workflow/create', workflowController.createWorkflow); // Create a new workflow
app.post('/workflow/:id/start', workflowController.startWorkflow); // Start a workflow by ID

// Listen for workflow-related messages
listenMessage("WORKFLOW", workflowController.startWorkflowListener);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).send("OK");
});

// Global error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.message, err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
function handleShutdown() {
    logger.info("Application shutting down...");
    process.exit(0);
}

process.on("SIGINT", handleShutdown); // Handle Ctrl+C
process.on("SIGTERM", handleShutdown); // Handle termination signals
