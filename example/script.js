document.getElementById('workflowForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const workflowName = document.getElementById('workflowName').value;
    const steps = gatherSteps();

    try {
        const response = await fetch('http://localhost:5000/workflow/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: workflowName,
                steps: steps,
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

document.getElementById('addStepBtn').addEventListener('click', function () {
    const stepCount = document.querySelectorAll('.step-entry').length + 1;
    addStepForm(stepCount);
});

function addStepForm(stepCount) {
    const stepEntry = document.createElement('div');
    stepEntry.classList.add('step-entry');
    stepEntry.setAttribute('data-step', stepCount);

    stepEntry.innerHTML = `
        <label for="type_${stepCount}">Step ${stepCount} Type:</label>
        <select id="type_${stepCount}" name="type" onchange="updateStepFields(${stepCount})" required>
            <option value="ACTION">ACTION</option>
            <option value="DECISION">DECISION</option>
            <option value="WAIT">WAIT</option>
        </select><br>
        <label for="task_${stepCount}">Task:</label>
        <input type="text" id="task_${stepCount}" name="task" placeholder="Task" required><br>
        <div id="actionFields_${stepCount}" class="action-fields">
            <label for="url_${stepCount}">URL:</label>
            <input type="text" id="url_${stepCount}" name="url" placeholder="Enter URL"><br>
            <label for="method_${stepCount}">Method:</label>
            <select id="method_${stepCount}" name="method">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
            </select><br>
        </div>
        <div id="decisionFields_${stepCount}" class="decision-fields" style="display:none;">
            <label for="condition_${stepCount}">Condition:</label>
            <input type="text" id="condition_${stepCount}" name="condition" placeholder="Condition"><br>
        </div>
        <div id="waitFields_${stepCount}" class="wait-fields" style="display:none;">
            <label for="waitTime_${stepCount}">Wait Time (seconds):</label>
            <input type="number" id="waitTime_${stepCount}" name="waitTime" placeholder="Wait Time"><br>
        </div>
        <label for="onSuccess_${stepCount}">On Success:</label>
        <input type="text" id="onSuccess_${stepCount}" name="onSuccess" placeholder="Next Step"><br>
        <label for="onFailure_${stepCount}">On Failure:</label>
        <input type="text" id="onFailure_${stepCount}" name="onFailure" placeholder="Error Handling"><br>
    `;

    document.getElementById('stepsList').appendChild(stepEntry);
}

function updateStepFields(stepCount) {
    const type = document.getElementById(`type_${stepCount}`).value;
    document.getElementById(`actionFields_${stepCount}`).style.display = (type === 'ACTION') ? 'block' : 'none';
    document.getElementById(`decisionFields_${stepCount}`).style.display = (type === 'DECISION') ? 'block' : 'none';
    document.getElementById(`waitFields_${stepCount}`).style.display = (type === 'WAIT') ? 'block' : 'none';
}


function gatherSteps() {
    const steps = [];
    document.querySelectorAll('.step-entry').forEach(stepEntry => {
        const step = {
            name: `step${stepEntry.dataset.step}`,
            type: "ACTION",
            task: document.getElementById(`task_${stepEntry.dataset.step}`).value,
            parameters: {
                url: document.getElementById(`url_${stepEntry.dataset.step}`).value,
                method: document.getElementById(`method_${stepEntry.dataset.step}`).value,
            },
            onSuccess: document.getElementById(`onSuccess_${stepEntry.dataset.step}`).value,
            onFailure: document.getElementById(`onFailure_${stepEntry.dataset.step}`).value,
        };
        steps.push(step);
    });
    return steps;
}
async function loadWorkflows() {
    try {
        const response = await fetch('http://localhost:5000/workflow/list');
        const data = await response.json();

        // Make sure the workflows array exists
        const workflows = data.workflows || [];
        const workflowList = document.getElementById('workflowList');
        workflowList.innerHTML = '';  // Clear the existing list

        workflows.forEach(workflow => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>${workflow.name}</strong> - State: <strong>${workflow.state}</strong>
                <ul>
                    ${workflow.steps.map(step => `
                        <li>
                            <strong>${step.name}</strong> - Task: ${step.task}
                            <br>Status: ${step.status}
                            <br>URL: ${step.parameters.url || 'N/A'}, Method: ${step.parameters.method || 'N/A'}
                            <br>Started At: ${step.startedAt ? new Date(step.startedAt).toLocaleString() : 'N/A'}
                            <br>Completed At: ${step.completedAt ? new Date(step.completedAt).toLocaleString() : 'N/A'}
                        </li>`).join('')}
                </ul>
            `;
            workflowList.appendChild(listItem);
        });
    } catch (error) {
        alert('Error loading workflows: ' + error.message);
    }
}


window.onload = loadWorkflows;
