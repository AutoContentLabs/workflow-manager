// startWorkflow.js
/**
 * Fetch with workflow start example.
 */

const startWorkflow = async (workflowId) => {
    try {
        const response = await fetch(`http://localhost:5000/workflow/${workflowId}/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // 
            }),
        });

        if (!response.ok) {
            throw new Error(`Workflow failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Workflow start:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

// Workflow ID
startWorkflow('6752fa84664a538e31ce5410');
