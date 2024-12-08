/**
 * @file example/workflows/functionExample.js
 */
const mongoose = require('mongoose');
const Workflow = require('../../src/models/workflowModel');

// Example for a FUNCTION event in the workflow
const functionEvent = new Workflow({
    name: 'Transform Data Function',
    description: 'Transforms data into a required format.',
    type: 'FUNCTION',  // Event Type is FUNCTION
    dependencies: ['Data Sync Service'],
    on_start: [{
        type: 'function',
        name: 'applyTransformation',
        parameters: { transformationType: 'normalize' },
        input: { data: 'syncedDataPath' },
        output: { transformedData: 'finalDataPath' },
        timestamp: new Date()
    }],
    on_success: [{
        type: 'status',
        name: 'markAsTransformed',
        timestamp: new Date()
    }],
    on_failure: [{
        type: 'function',
        name: 'retryTransformation',
        timestamp: new Date()
    }],
    status: 'PENDING',
    startedAt: null,
    completedAt: null
});

functionEvent.save()
    .then(() => console.log('Function Event Created'))
    .catch(err => console.log('Error creating function event:', err));
