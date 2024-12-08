/**
 * @file example/workflows/actionExample.js
 */
const mongoose = require('mongoose');
const Workflow = require('../../src/models/workflowModel');

// Example for an ACTION event in the workflow
const actionEvent = new Workflow({
    name: 'Notify Completion',
    description: 'Notify the team when the process is completed.',
    type: 'ACTION',  // Event Type is ACTION
    dependencies: [],
    on_start: [{
        type: 'action',
        name: 'sendNotification',
        parameters: { email: 'team@example.com', message: 'ETL process completed successfully.' },
        timestamp: new Date()
    }],
    on_success: [{
        type: 'status',
        name: 'markNotificationSent',
        timestamp: new Date()
    }],
    on_failure: [{
        type: 'function',
        name: 'retryNotification',
        timestamp: new Date()
    }],
    status: 'PENDING',
    startedAt: null,
    completedAt: null
});

actionEvent.save()
    .then(() => console.log('Action Event Created'))
    .catch(err => console.log('Error creating action event:', err));
