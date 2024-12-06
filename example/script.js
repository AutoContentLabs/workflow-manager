document.getElementById('workflowForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const workflowName = document.getElementById('workflowName').value;
    const steps = document.getElementById('steps').value;

    try {
        const response = await fetch('http://localhost:5000/workflow/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: workflowName,
                steps: JSON.parse(steps),
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert('Error: ' + errorData.message);
        } else {
            const data = await response.json();
            alert('Workflow created: ' + JSON.stringify(data.workflow));
            loadWorkflows(); // Refresh the list after creating the workflow
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

async function loadWorkflows() {
    try {
        const response = await fetch('http://localhost:5000/workflow/list');
        const data = await response.json();
        
        if (data.message !== "Workflows fetched successfully.") {
            alert('Error fetching workflows: ' + data.message);
            return;
        }
        
        const workflows = data.workflows;
        const workflowList = document.getElementById('workflowList');
        workflowList.innerHTML = '';

        workflows.forEach(workflow => {
            const listItem = document.createElement('li');
            const stepsText = workflow.steps.map(step => {
                return `${step.name} (${step.status}) - Started: ${step.startedAt ? new Date(step.startedAt).toLocaleString() : 'N/A'}, Completed: ${step.completedAt ? new Date(step.completedAt).toLocaleString() : 'N/A'}`;
            }).join('<br>');

            listItem.innerHTML = `<strong>${workflow.name}</strong><br>State: ${workflow.state}<br>Steps:<br>${stepsText}<br><br>`;
            workflowList.appendChild(listItem);
        });
    } catch (error) {
        alert('Error loading workflows: ' + error.message);
    }
}

window.onload = loadWorkflows;  // Load workflows on page load
