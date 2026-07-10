/* ============================================================
   planner.js — Academic Incident Log (task management system)
   Demonstrates: DOM manipulation, event handling, arrays,
   functions, dynamic content updates.
   ============================================================ */

(() => {
  const STORAGE_KEY = 'ss_academic_planner_tasks';

  const form        = document.querySelector('#task-form');
  const titleInput  = document.querySelector('#task-title');
  const dateInput   = document.querySelector('#task-date');
  const priorityInp = document.querySelector('#task-priority');
  const list        = document.querySelector('#task-list');
  const emptyState  = document.querySelector('#empty-state');
  const statTotal   = document.querySelector('#stat-total');
  const statOpen    = document.querySelector('#stat-open');
  const statDone    = document.querySelector('#stat-done');

  if (!form || !list) return; // not on planner page

  /** @type {Array<{id:string, title:string, due:string, priority:string, done:boolean}>} */
  let tasks = [];

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      tasks = raw ? JSON.parse(raw) : seedTasks();
    } catch (e) {
      tasks = seedTasks();
    }
  }

  function seedTasks() {
    return [
      { id: cryptoId(), title: 'Submit CIT 101 assignment on binary systems', due: '', priority: 'high', done: false },
      { id: cryptoId(), title: 'Read Chapter 3 — Intro to Cryptography', due: '', priority: 'medium', done: false },
      { id: cryptoId(), title: 'Review COS 106 term project checklist', due: '', priority: 'high', done: true },
    ];
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function cryptoId() {
    return 'tid_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function formatDue(due) {
    if (!due) return 'No due date';
    const d = new Date(due + 'T00:00:00');
    if (isNaN(d)) return due;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function render() {
    list.innerHTML = '';

    if (tasks.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      tasks.forEach(task => {
        const item = document.createElement('div');
        item.className = 'task-item' + (task.done ? ' done' : '');
        item.dataset.id = task.id;

        item.innerHTML = `
          <div class="task-check ${task.done ? 'checked' : ''}" role="checkbox" aria-checked="${task.done}" tabindex="0" aria-label="Mark task complete"></div>
          <div class="task-body">
            <div class="task-title"></div>
            <div class="task-sub">
              <span>DUE · ${formatDue(task.due)}</span>
              <span class="tag ${task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'amber' : 'cyan'}">${task.priority.toUpperCase()} PRIORITY</span>
            </div>
          </div>
          <button class="task-del" aria-label="Delete task">DELETE</button>
        `;
        // set text via textContent to avoid any HTML injection from user input
        item.querySelector('.task-title').textContent = task.title;
        list.appendChild(item);
      });
    }

    updateStats();
  }

  function updateStats() {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    statTotal.textContent = total;
    statDone.textContent = done;
    statOpen.textContent = total - done;
  }

  function addTask(title, due, priority) {
    tasks.unshift({ id: cryptoId(), title, due, priority, done: false });
    saveTasks();
    render();
  }

  function toggleTask(id) {
    const t = tasks.find(t => t.id === id);
    if (t) {
      t.done = !t.done;
      saveTasks();
      render();
    }
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    if (!title) {
      titleInput.focus();
      return;
    }
    addTask(title, dateInput.value, priorityInp.value);
    form.reset();
    titleInput.focus();
  });

  list.addEventListener('click', (e) => {
    const id = e.target.closest('.task-item')?.dataset.id;
    if (!id) return;
    if (e.target.classList.contains('task-check')) toggleTask(id);
    if (e.target.classList.contains('task-del')) deleteTask(id);
  });

  list.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('task-check')) {
      e.preventDefault();
      const id = e.target.closest('.task-item')?.dataset.id;
      if (id) toggleTask(id);
    }
  });

  loadTasks();
  render();
})();
