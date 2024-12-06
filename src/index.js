// src\index.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const { listenMessage } = require('./utils/messaging');
const workflowController = require('./controllers/workflowController');
const logger = require("./utils/logger")
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

connectDB(); require("./initialize")

app.post('/workflow/create', workflowController.createWorkflow);
app.post('/workflow/:id/start', workflowController.startWorkflow);

listenMessage("workflow", workflowController.startWorkflowListener);

app.listen(PORT, () => {
    logger.notice(`Server is running on http://localhost:${PORT}`);
});

function handleShutdown() {
    logger.info("Application shutting down...");
    process.exit(0);
}

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);