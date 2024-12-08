/**
 * @file example/workflows/Pipeline.js
 */
const Workflow = require('../../src/models/workflowModel');

const pipelineWorkflow = new Workflow({
    name: 'Example Pipeline Workflow',
    description: 'A pipeline style workflow example',
    type: 'PIPELINE',
    state: 'PENDING',
    status: 'PENDING',
    dependencies: [],
    on_start: [
        {
            type: 'config',
            name: 'initialize_pipeline',
            parameters: { retries: 3, timeout: 120 },
            timestamp: new Date()
        }
    ],
    on_success: [
        {
            type: 'status',
            name: 'pipeline_success',
            timestamp: new Date()
        }
    ],
    on_failure: [
        {
            type: 'rollback',
            name: 'rollback_pipeline',
            timestamp: new Date()
        }
    ],
    steps: [
        {
            name: 'Step 1: Initialize',
            description: 'Initialize pipeline configuration',
            type: 'TASK',
            dependencies: [],
            on_start: [
                {
                    type: 'task',
                    name: 'init_task',
                    parameters: { config: 'default' },
                    input: { path: '/config' },
                    output: { result: 'success' },
                    timestamp: new Date()
                }
            ],
            status: 'PENDING'
        },
        {
            name: 'Step 2: Run Job',
            description: 'Run main job of the pipeline',
            type: 'TASK',
            dependencies: ['Step 1: Initialize'],
            on_start: [
                {
                    type: 'task',
                    name: 'run_job',
                    parameters: { job_name: 'main' },
                    input: { data: '/data/input' },
                    output: { result: 'success' },
                    timestamp: new Date()
                }
            ],
            status: 'PENDING'
        }
    ],
    startedAt: new Date(),
    completedAt: null
});

pipelineWorkflow.save()
    .then(() => console.log('Pipeline workflow created successfully'))
    .catch((err) => console.log('Error creating pipeline workflow:', err));
