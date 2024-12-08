/**
 * @file example/workflows/DAG.js
 */
const Workflow = require('../../src/models/workflowModel');

const dagWorkflow = new Workflow({
    name: 'Example DAG Workflow',
    description: 'A directed acyclic graph (DAG) workflow example',
    type: 'DAG',
    state: 'PENDING',
    status: 'PENDING',
    dependencies: [],
    on_start: [
        {
            type: 'service',
            name: 'initialize_dag',
            parameters: { retries: 5 },
            timestamp: new Date()
        }
    ],
    on_success: [
        {
            type: 'status',
            name: 'dag_success',
            timestamp: new Date()
        }
    ],
    on_failure: [
        {
            type: 'rollback',
            name: 'dag_failure',
            timestamp: new Date()
        }
    ],
    steps: [
        {
            name: 'Step 1: Start Process',
            description: 'Start DAG process',
            type: 'TASK',
            dependencies: [],
            on_start: [
                {
                    type: 'task',
                    name: 'start_task',
                    parameters: { initial: 'true' },
                    input: { start_time: '2024-12-01T00:00:00' },
                    output: { status: 'started' },
                    timestamp: new Date()
                }
            ],
            status: 'PENDING'
        },
        {
            name: 'Step 2: Process Data',
            description: 'Process data in the DAG workflow',
            type: 'TASK',
            dependencies: ['Step 1: Start Process'],
            on_start: [
                {
                    type: 'task',
                    name: 'process_data',
                    parameters: { data_path: '/data/input' },
                    input: { process: 'true' },
                    output: { result: 'processed' },
                    timestamp: new Date()
                }
            ],
            status: 'PENDING'
        },
        {
            name: 'Step 3: Complete Process',
            description: 'Finalize the DAG workflow',
            type: 'TASK',
            dependencies: ['Step 2: Process Data'],
            on_start: [
                {
                    type: 'task',
                    name: 'complete_process',
                    parameters: { finalize: 'true' },
                    input: { data: '/data/output' },
                    output: { status: 'complete' },
                    timestamp: new Date()
                }
            ],
            status: 'PENDING'
        }
    ],
    startedAt: new Date(),
    completedAt: null
});

dagWorkflow.save()
    .then(() => console.log('DAG workflow created successfully'))
    .catch((err) => console.log('Error creating DAG workflow:', err));
