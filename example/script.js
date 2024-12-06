// script.js
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
            loadWorkflows();
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});


async function loadWorkflows() {
    try {
        const response = await fetch('http://localhost:5000/workflow/list');
        const workflows = await response.json();
        const workflowList = document.getElementById('workflowList');
        workflowList.innerHTML = '';

        Object.values(workflows).forEach(workflow => {
            const listItem = document.createElement('li');
            listItem.textContent = workflow.name + ': ' + JSON.stringify(workflow.steps);
            workflowList.appendChild(listItem);
        });
    } catch (error) {
        alert('Error loading workflows: ' + error.message);
    }
}


window.onload = loadWorkflows;
