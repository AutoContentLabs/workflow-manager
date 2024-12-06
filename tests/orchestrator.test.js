/**
 * @file tests/orchestrator.test.js
 */
const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');
const Workflow = require('../src/models/workflowModel'); // Assuming you have a model for workflows

describe('Workflow Manager', () => {
    let workflowId;

    // Set up a test workflow before all tests
    beforeAll(async () => {
        await mongoose.connect('mongodb://mongo_user:mongo_password@localhost:27017/WORKFLOW_MANAGER?authSource=admin', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Create a test workflow in the database
        const testWorkflow = new Workflow({
            name: 'Data Collection Workflow',
            steps: [
                { task: 'Fetch Data', onFailure: 'Retry Fetch' },
                { task: 'Process Data', onFailure: 'Retry Process' }
            ]
        });
        const savedWorkflow = await testWorkflow.save();
        workflowId = savedWorkflow._id; // Store the ID of the created workflow for use in the test
    });

    it('should start a workflow', async () => {
        const response = await request(app)
            .post(`/workflow/${workflowId}/start`)  // Use the actual workflow ID
            .send({
                name: 'Data Collection Workflow',
                steps: [{ task: 'Fetch Data', onFailure: 'Retry Fetch' }]
            });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Workflow executed successfully');
    });

    // Clean up the database after tests
    afterAll(async () => {
        await Workflow.deleteMany();  // Clear workflows after tests
        await mongoose.disconnect();
    });
});
