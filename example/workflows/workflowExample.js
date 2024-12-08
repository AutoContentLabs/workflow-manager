/**
 * @file example/workflows/workflowExample.js
 */
const mongoose = require('mongoose');
const Workflow = require('../src/models/workflowModel');

// Example for a WORKFLOW event in the workflow (DAG workflow)
const workflowEvent = new Workflow({
    name: 'ETL Process Workflow',
    description: 'Complete data pipeline from extraction to transformation and loading.',
    type: 'DAG',  // Event Type is WORKFLOW (Directed Acyclic Graph)
    state: 'IDLE',
    status: 'IDLE',
    dependencies: [],
    on_start: [{
        type: 'config',
        name: 'initializeETL',
        parameters: { configFile: 'etl_config.json' },
        timestamp: new Date()
    }],
    on_success: [{
        type: 'action',
        name: 'notifyCompletion',
        timestamp: new Date()
    }],
    on_failure: [{
        type: 'rollback',
        name: 'rollbackETL',
        timestamp: new Date()
    }],
    steps: [
        {
            name: 'Extract Data',
            description: 'Extracts data from source.',
            type: 'TASK',
            dependencies: [],
            on_start: [{
                type: 'task',
                name: 'extractData',
                parameters: { source: 'API' },
                input: { endpoint: 'https://api.example.com/data' },
                output: { rawData: 'dataPath' },
                timestamp: new Date()
            }],
            on_success: [{ type: 'status', name: 'dataExtracted', timestamp: new Date() }],
            on_failure: [{ type: 'function', name: 'retryExtraction', timestamp: new Date() }],
            status: 'PENDING',
            startedAt: null,
            completedAt: null
        },
        {
            name: 'Transform Data',
            description: 'Transforms data to required format.',
            type: 'FUNCTION',
            dependencies: ['Extract Data'],
            on_start: [{
                type: 'function',
                name: 'applyTransformation',
                parameters: { type: 'normalize' },
                input: { data: 'rawData' },
                output: { transformedData: 'finalData' },
                timestamp: new Date()
            }],
            on_success: [{ type: 'status', name: 'dataTransformed', timestamp: new Date() }],
            on_failure: [{ type: 'function', name: 'retryTransformation', timestamp: new Date() }],
            status: 'PENDING',
            startedAt: null,
            completedAt: null
        }
    ],
    startedAt: null,
    completedAt: null
});

workflowEvent.save()
    .then(() => console.log('Workflow Event Created'))
    .catch(err => console.log('Error creating workflow event:', err));
