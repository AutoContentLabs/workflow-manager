// Submit Workflow Form
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
            document.getElementById('loadingSpinner').style.display = 'none';
            updateTaskStatus('error', errorData.message);
        } else {
            const data = await response.json();
            loadWorkflows(); // Refresh workflows list to show the new one
            updateTaskStatus('success', 'Workflow created successfully');
        }
    } catch (error) {
        document.getElementById('loadingSpinner').style.display = 'none';
        updateTaskStatus('error', error.message);
    }
});

// Add Step to Workflow
document.getElementById('addStepBtn').addEventListener('click', function () {
    const stepCount = document.querySelectorAll('.step-entry').length + 1;
    addStepForm(stepCount);
});

// Add Step Form Fields
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
      <div id="status_${stepCount}" class="status pending">Status: Pending</div>
      <div id="completedAt_${stepCount}" class="completedAt">Completed At: N/A</div>
      <button type="button" onclick="startTask(${stepCount})">Start Task</button>
    `;

    document.getElementById('stepsList').appendChild(stepEntry);
}

// Start Task and Update Status
async function startTask(stepCount) {
    const statusElement = document.getElementById(`status_${stepCount}`);
    const completedAtElement = document.getElementById(`completedAt_${stepCount}`);

    // Update status to In Progress
    statusElement.textContent = 'Status: In Progress';
    statusElement.classList.remove('pending');
    statusElement.classList.add('in-progress');

    // Simulate task processing (e.g., API call)
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate task running for 3 seconds

    // Update status to Completed
    const completedAt = new Date().toISOString();
    statusElement.textContent = 'Status: Completed';
    statusElement.classList.remove('in-progress');
    statusElement.classList.add('completed');

    completedAtElement.textContent = `Completed At: ${completedAt}`;

    // Update task in the backend (optional, based on your workflow logic)
    // await updateTaskStatusBackend(stepCount, completedAt); // If necessary, update backend with new status
}

// Gather all Steps
function gatherSteps() {
    const steps = [];
    document.querySelectorAll('.step-entry').forEach((stepEntry) => {
        const step = {
            name: `step${stepEntry.dataset.step}`,
            type: document.getElementById(`type_${stepEntry.dataset.step}`).value,
            task: document.getElementById(`task_${stepEntry.dataset.step}`).value,
            parameters: {
                url: document.getElementById(`url_${stepEntry.dataset.step}`).value,
                method: document.getElementById(`method_${stepEntry.dataset.step}`).value,
            },
            condition: document.getElementById(`condition_${stepEntry.dataset.step}`)?.value || '',
            waitTime: document.getElementById(`waitTime_${stepEntry.dataset.step}`)?.value || '',
            onSuccess: document.getElementById(`onSuccess_${stepEntry.dataset.step}`).value,
            onFailure: document.getElementById(`onFailure_${stepEntry.dataset.step}`).value,
        };

        steps.push(step);
    });
    return steps;
}


// Load Existing Workflows
async function loadWorkflows() {
    try {
        const response = await fetch('http://localhost:5000/workflow/list');
        const data = await response.json();

        const workflows = data.workflows || [];
        const workflowList = document.getElementById('workflowList');
        workflowList.innerHTML = ''; // Clear existing list

        workflows.forEach(workflow => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                        <strong>${workflow.name}</strong><br>
                        <div class="workflow-actions">
                            <button onclick="startWorkflow('${workflow._id}')">Start</button>
                        </div>
                        <ul>
                            ${workflow.steps.map(step => `
                                <li>
                                    <strong>${step.name}</strong>: ${step.type}<br>
                                    Task: ${step.task}<br>
                                    Status: <span id="status-${step.name}">Pending</span><br>
                                    ${step.completedAt ? `Completed At: ${new Date(step.completedAt).toLocaleString()}` : 'Not Completed'}
                                </li>
                            `).join('')}
                        </ul>
                    `;
            workflowList.appendChild(listItem);
        });
    } catch (error) {
        alert('Error loading workflows: ' + error.message);
    }
}

// Start Workflow
async function startWorkflow(workflowId) {
    try {
        const response = await fetch(`http://localhost:5000/workflow/${workflowId}/start`, {
            method: 'POST',
        });

        if (response.ok) {
            alert(`Workflow ${workflowId} started successfully!`);
            loadWorkflows(); // Refresh workflows list
        } else {
            const errorData = await response.json();
            alert('Error starting workflow: ' + errorData.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

loadWorkflows();