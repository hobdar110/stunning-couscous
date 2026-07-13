/**
 * Dynamic Task Planner Logic - Week 1 Task
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Element Selectors
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescInput = document.getElementById('task-desc');
    const tasksContainer = document.getElementById('tasks-container');
    const emptyState = document.getElementById('empty-state');
    const taskCountEl = document.getElementById('task-count');

    // 2. Local State Array
    let tasksArray = [];

    // Defensive check to make sure elements exist before binding listeners
    if (!taskForm || !tasksContainer) {
        console.error("Critical DOM elements are missing. Halting application initialization.");
        return;
    }

    // 3. Render function
    function renderTasks() {
        // Clear previous runtime nodes to avoid duplicates
        tasksContainer.innerHTML = '';

        if (tasksArray.length === 0) {
            // Show empty state fallback if no tasks remain
            tasksContainer.appendChild(emptyState);
            taskCountEl.textContent = '0';
            return;
        }

        // Re-compile dynamic cards
        tasksArray.forEach((task) => {
            const cardElement = document.createElement('article');
            cardElement.className = 'task-card';
            cardElement.setAttribute('data-id', task.id);

            cardElement.innerHTML = `
                <div>
                    <h3>${escapeHTML(task.title)}</h3>
                    <p>${escapeHTML(task.description)}</p>
                </div>
                <button class="btn-delete" aria-label="Delete ${escapeHTML(task.title)}">Delete</button>
            `;

            tasksContainer.appendChild(cardElement);
        });

        // Update count element
        taskCountEl.textContent = tasksArray.length;
    }

    // Helper: Escapes HTML to prevent XSS vulnerabilities
    function escapeHTML(str) {
        return str.replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;")
                  .replace(/'/g, "&#039;");
    }

    // 4. Form Submission Event
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent page reload

        const titleValue = taskTitleInput.value.trim();
        const descValue = taskDescInput.value.trim();

        if (titleValue === '' || descValue === '') return;

        const newTask = {
            id: Date.now().toString(),
            title: titleValue,
            description: descValue
        };

        tasksArray.push(newTask);

        // Reset inputs and update DOM
        taskTitleInput.value = '';
        taskDescInput.value = '';
        renderTasks();
    });

    // 5. Dynamic Event Delegation
    tasksContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-delete')) {
            const card = event.target.closest('.task-card');
            if (card) {
                const targetId = card.getAttribute('data-id');
                tasksArray = tasksArray.filter(task => task.id !== targetId);
                renderTasks();
            }
        }
    });
});