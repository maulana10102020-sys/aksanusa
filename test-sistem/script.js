// Ambil elemen DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');
const clearAllBtn = document.getElementById('clearAllBtn');

// Data tugas
let tasks = [];

// Load dari localStorage
function loadTasks() {
    const stored = localStorage.getItem('taskflow_tasks');
    if (stored) {
        tasks = JSON.parse(stored);
    }
    renderTasks();
}

// Simpan ke localStorage
function saveTasks() {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
}

// Render semua tugas
function renderTasks() {
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <li class="text-center text-gray-400 py-8">
                <i class="fas fa-clipboard-list text-4xl mb-2 block"></i>
                Belum ada tugas. Tambahkan tugas baru!
            </li>
        `;
    } else {
        taskList.innerHTML = tasks.map((task, index) => `
            <li class="task-enter flex items-center justify-between p-4 hover:bg-gray-50 transition">
                <div class="flex items-center gap-3 flex-1">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} 
                           data-index="${index}" class="task-checkbox w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500">
                    <span class="${task.completed ? 'line-through text-gray-400' : 'text-gray-700'} flex-1">
                        ${escapeHtml(task.text)}
                    </span>
                </div>
                <button data-index="${index}" class="delete-btn text-red-400 hover:text-red-600 transition p-1">
                    <i class="fas fa-times"></i>
                </button>
            </li>
        `).join('');
    }

    // Update statistik
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    totalTasksSpan.textContent = `${total} tugas`;
    completedTasksSpan.textContent = `${completed} selesai`;

    // Pasang event listener ke checkbox dan tombol delete setelah render
    document.querySelectorAll('.task-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const idx = parseInt(e.target.dataset.index);
            tasks[idx].completed = e.target.checked;
            saveTasks();
            renderTasks(); // re-render agar class line-through update
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.dataset.index);
            tasks.splice(idx, 1);
            saveTasks();
            renderTasks();
        });
    });
}

// Escape HTML untuk keamanan
function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Tambah tugas baru
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;
    tasks.push({ text: text, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
}

// Hapus semua tugas
function clearAllTasks() {
    if (confirm('Hapus semua tugas? Tindakan ini tidak bisa dibatalkan.')) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}

// Event listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
clearAllBtn.addEventListener('click', clearAllTasks);

// Inisialisasi
loadTasks();