/**
 * @file example/workflows/Linear.js
 */
const Workflow = require('../../src/models/workflowModel');

const linearWorkflow = new Workflow({
    name: 'Example Linear Workflow',
    description: 'A linear workflow example where steps are executed in sequence',
    type: 'LINEAR',
    state: 'PENDING',
    status: 'PENDING',
    dependencies: [],
    on_start: [
        {
            type: 'config',
            name: 'initialize_linear',
            parameters: { retries: 1 },
            timestamp: new Date()
        }
    ],
    on_success: [
        {
            type: 'action',
            name: 'linear_success_action',
            timestamp: new Date()
        }
    ],
    on_failure: [
        {
            type: 'rollback',
            name: 'rollback_linear',
            timestamp: new Date()
        }
    ],
    steps: [
        {
            name: 'Step 1: Start Linear Process',
            description: 'Start linear process execution',
            type: 'TASK',
            dependencies: [],
            on_start: [
                {
                    type: 'task',
                    name: 'start_linear_task',
                    parameters: { init: true },
                    input: { data: '/data/input' },
                    output: { result: 'started' },
                    timestamp: new Date()
                }
            ],
            status: 'PENDING'
        },
        {
            name: 'Step 2: Execute Task',
            description: 'Execute the task in linear flow',
            type: 'TASK',
            dependencies: ['Step 1: Start Linear Process'],
            on_start: [
                {
                    type: 'task',
                    name: 'execute_task',
                    parameters: { task_name: 'task_1' },
                    input: { data: '/data/task_input' },
                    output: { status: 'completed' },
                    timestamp: new Date()
                }
            ],
            status: 'PENDING'
        },
        {
            name: 'Step 3: Finish Process',
            description: 'Complete the linear process',
            type: 'TASK',
            dependencies: ['Step 2: Execute Task'],
            on_start: [
                {
                    type: 'task',
                    name: 'finish_linear_task',
                    parameters: { finalize: true },
                    input: { result: '/data/output' },
                    output: { final_status: 'success' },
                    timestamp: new Date()
                }
            ],
            status: 'PENDING'
        }
    ],
    startedAt: new Date(),
    completedAt: null
});

linearWorkflow.save()
    .then(() => console.log('Linear workflow created successfully'))
    .catch((err) => console.log('Error creating linear workflow:', err));
