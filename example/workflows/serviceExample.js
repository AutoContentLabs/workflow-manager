/**
 * @file example/workflows/serviceExample.js
 */
const mongoose = require('mongoose');
const Workflow = require('../../src/models/workflowModel');

// Example for a SERVICE event in the workflow
const serviceEvent = new Workflow({
    name: 'Data Sync Service',
    description: 'Syncs data from external API to internal database.',
    type: 'SERVICE',  // Event Type is SERVICE
    dependencies: ['Data Cleaning Task'],
    on_start: [{
        type: 'service',
        name: 'syncDataService',
        parameters: { apiEndpoint: 'https://api.example.com/data' },
        input: { data: 'cleanedDataPath' },
        output: { syncedData: 'dbTable' },
        timestamp: new Date()
    }],
    on_success: [{
        type: 'step',
        name: 'logSuccess',
        timestamp: new Date()
    }],
    on_failure: [{
        type: 'rollback',
        name: 'revertSync',
        timestamp: new Date()
    }],
    status: 'PENDING',
    startedAt: null,
    completedAt: null
});

serviceEvent.save()
    .then(() => console.log('Service Event Created'))
    .catch(err => console.log('Error creating service event:', err));
