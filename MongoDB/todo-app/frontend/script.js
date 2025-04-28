const API_URL = 'http://localhost:5000/tasks';

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

async function loadTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();

    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.onclick = () => toggleTask(task._id, !task.completed);

        const taskDiv = document.createElement('div');
        taskDiv.innerHTML = `
            <strong>${task.title}</strong><br>
            <small>${task.description || 'No description'}</small><br>
            <small>Created: ${new Date(task.createdAt).toLocaleString()}</small>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTask(task._id);

        li.appendChild(checkbox);
        li.appendChild(taskDiv);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}

async function addTask() {
    const titleInput = document.getElementById('taskTitle');
    const descInput = document.getElementById('taskDescription');

    const title = titleInput.value.trim();
    const description = descInput.value.trim();

    if (!title) return alert('Title is required!');

    await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
    });

    titleInput.value = '';
    descInput.value = '';
    loadTasks();
}

async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    loadTasks();
}

async function toggleTask(id, completed) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
    });
    loadTasks();
}