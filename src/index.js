const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const { listenMessage } = require('./utils/messaging');
const workflowController = require('./controllers/workflowController');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

connectDB();

listenMessage("workflow", workflowController.startWorkflowListener);

// Workflow endpoint
app.post('/workflow/:id/start', workflowController.startWorkflow);

app.listen(PORT, () => {
    logger.notice(`Server is running on http://localhost:${PORT}`);
});
