// createWorkflow.js
/**
* Example of creating a workflow with Fetch.
 */

const createWorkflow = async () => {
    try {
        const response = await fetch('http://localhost:5000/workflow/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'example_workflow',
                steps: [
                    {
                        name: 'step1',
                        type: 'ACTION',
                        task: 'JOB_SCHEDULE_CREATE',
                        parameters: { url: 'https://example.com', method: 'GET' },
                        onSuccess: 'step2',
                        onFailure: 'handleFailure',
                    },
                    {
                        name: 'step2',
                        type: 'ACTION',
                        task: 'DATA_COLLECT_REQUEST',
                        parameters: { url: 'https://example.com', method: 'GET' },
                        onSuccess: 'step3',
                        onFailure: 'handleFailure',
                    },
                ],
            }),
        });

        // Throw an error if the request is not successful
        if (!response.ok) {
            const errorText = await response.text();  // Get the error message
            throw new Error(`Workflow creation failed: ${response.statusText}, ${errorText}`);
        }

        const data = await response.json();
        console.log('Workflow created:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

// Start creating a workflow
createWorkflow();
