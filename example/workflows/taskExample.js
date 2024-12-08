/**
 * @file example/workflows/taskExample.js
 */
const mongoose = require('mongoose');
const Workflow = require('../../src/models/workflowModel');

// Example for a TASK event in the workflow
const taskEvent = new Workflow({
    name: 'Data Cleaning Task',
    description: 'Cleans raw data before processing.',
    type: 'TASK',  // Event Type is TASK
    dependencies: [],
    on_start: [{
        type: 'task',
        name: 'initializeCleaningTask',
        parameters: { priority: 'high', batchSize: 100 },
        input: { rawData: 'sourceDataPath' },
        output: { cleanedData: 'destinationPath' },
        timestamp: new Date()
    }],
    on_success: [{
        type: 'status',
        name: 'markAsCleaned',
        timestamp: new Date()
    }],
    on_failure: [{
        type: 'function',
        name: 'retryCleaning',
        timestamp: new Date()
    }],
    status: 'PENDING',
    startedAt: null,
    completedAt: null
});

taskEvent.save()
    .then(() => console.log('Task Event Created'))
    .catch(err => console.log('Error creating task event:', err));
