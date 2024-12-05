const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');

describe('Workflow Manager', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://mongo_user:mongo_password@localhost:27017/WORKFLOW_MANAGER?authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    it('should start a workflow', async () => {
        const response = await request(app)
            .post('/workflow/{WORKFLOW_ID}/start')
            .send({
                name: 'Data Collection Workflow',
                steps: [{ task: 'Fetch Data', onFailure: 'Retry Fetch' }]
            });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Workflow executed successfully');
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });
});
