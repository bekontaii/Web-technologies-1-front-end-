// ==================== AutoVerdict — Optimized Interactive Script ====================

// Инициализация всех функций при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  initTheme();   
  initContactForm();
  initTodo();
  initTeslaGallery();
});



// ==================== 2) Contact Form Validation ====================
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const nameEl = document.getElementById("fullName");
  const emailEl = document.getElementById("email");
  const passEl = document.getElementById("password");
  const confEl = document.getElementById("confirm");
  const errEl = document.getElementById("formErrors");
  const okEl = document.getElementById("formOk");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errEl.innerHTML = "";
    okEl.textContent = "";
    const errors = [];

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const pass = passEl.value;
    const conf = confEl.value;

    if (!name) errors.push("Name is required.");
    if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) errors.push("Enter a valid email address.");
    if (pass.length < 6) errors.push("Password must be at least 6 characters.");
    if (pass !== conf) errors.push("Passwords do not match.");

    if (errors.length) {
      errEl.innerHTML = "<ul>" + errors.map(t => `<li>${t}</li>`).join("") + "</ul>";
      errEl.classList.remove("d-none");
    } else {
      errEl.classList.add("d-none");
      okEl.textContent = "✅ Form successfully validated!";
      okEl.classList.add("animate__animated", "animate__fadeInUp");
      form.reset();
    }
  });
}

// ==================== 3) To-Do List with LocalStorage ====================
 // To-Do List
        let tasks = JSON.parse(localStorage.getItem('carChecklist')) || [];

        document.getElementById('add-task-btn').addEventListener('click', addTask);
        document.getElementById('task-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
        });
        document.getElementById('clear-completed-btn').addEventListener('click', clearCompleted);

        function addTask() {
            const input = document.getElementById('task-input');
            const taskText = input.value.trim();
            
            if (!taskText) {
                showMessage('Please enter a task', 'error');
                return;
            }
            
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false,
                createdAt: new Date().toLocaleString()
            };
            
            tasks.push(newTask);
            saveToLocalStorage();
            renderTasks();
            input.value = '';
            showMessage('Task added successfully!', 'success');
        }

        function deleteTask(taskId) {
            tasks = tasks.filter(task => task.id !== taskId);
            saveToLocalStorage();
            renderTasks();
            showMessage('Task deleted', 'info');
        }

        function toggleTask(taskId) {
            tasks = tasks.map(task => 
                task.id === taskId ? { ...task, completed: !task.completed } : task
            );
            saveToLocalStorage();
            renderTasks();
        }

        function clearCompleted() {
            tasks = tasks.filter(task => !task.completed);
            saveToLocalStorage();
            renderTasks();
            showMessage('Completed tasks cleared', 'info');
        }

        function renderTasks() {
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';
            
            if (tasks.length === 0) {
                taskList.innerHTML = '<p class="text-muted text-center">No tasks yet. Add your first car buying task!</p>';
                updateProgress();
                return;
            }
            
            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskElement.innerHTML = `
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                               ${task.completed ? 'checked' : ''} 
                               onchange="toggleTask(${task.id})">
                        <label class="form-check-label ${task.completed ? 'text-decoration-line-through' : ''}">
                            ${task.text}
                        </label>
                        <small class="text-muted d-block">Added: ${task.createdAt}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" 
                            onclick="deleteTask(${task.id})">
                        Delete
                    </button>
                `;
                taskList.appendChild(taskElement);
            });
            
            updateProgress();
        }

        function updateProgress() {
            const completedTasks = tasks.filter(task => task.completed).length;
            const totalTasks = tasks.length;
            const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            
            document.getElementById('progress-bar').style.width = `${progress}%`;
            document.getElementById('progress-text').textContent = 
                `${completedTasks}/${totalTasks} tasks completed`;
        }

        function showMessage(message, type) {
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = message;
            messageDiv.className = `alert alert-${type}`;
            messageDiv.style.display = 'block';
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }

        function saveToLocalStorage() {
            localStorage.setItem('carChecklist', JSON.stringify(tasks));
        }

        // Initial render
        renderTasks();
// ==================== 7) Tesla Gallery Fade Animation ====================
// ===== Tesla Gallery with Side Arrows + Thumbnails =====
function initTeslaGallery() {
  const imgs = [
    "https://images.hgmsites.net/hug/2024-tesla-model-3_100940488_h.webp",
    "https://images.hgmsites.net/hug/2024-tesla-model-3_100940490_h.webp",
    "https://images.hgmsites.net/hug/2024-tesla-model-3_100940487_h.webp",
    "https://images.hgmsites.net/hug/2024-tesla-model-3_100940473_h.webp"
  ];

  let index = 0;
  const main = document.getElementById("teslaMain");
  const prev = document.getElementById("prevTesla");
  const next = document.getElementById("nextTesla");
  const thumbs = document.querySelectorAll(".thumb");

  if (!main) return;

  function show(i) {
    index = (i + imgs.length) % imgs.length;
    main.style.opacity = 0;
    setTimeout(() => {
      main.src = imgs[index];
      main.style.opacity = 1;
      thumbs.forEach((t, j) => t.classList.toggle("active", j === index));
    }, 200);
  }

  next.addEventListener("click", () => show(index + 1));
  prev.addEventListener("click", () => show(index - 1));
  thumbs.forEach((thumb, i) => thumb.addEventListener("click", () => show(i)));
}

// === THEME: auto (system) / light / dark ===========================
// Логика:
// 1) Если есть сохранённый выбор в localStorage('theme'): применяем его ('light'|'dark').
// 2) Если нет — следуем за системой (prefers-color-scheme).
// 3) Кнопка циклично меняет режим: System → Dark → Light → System...
function initTheme() {
  // 1) Подготовим (на всех страницах добавляем кнопку, если её нет)
  ensureThemeToggleButton();

  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  // применить тему
  const applyTheme = (mode) => {
    // mode: 'system'|'dark'|'light'
    const body = document.body;

    // убрать все классы
    body.classList.remove("theme-dark");

    if (mode === "dark") {
      body.classList.add("theme-dark");
    } else if (mode === "system") {
      // Если system — смотрим на медиа-запрос
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) body.classList.add("theme-dark");
    }
    // подпись на кнопке
    btn.textContent = mode === "system" ? "🌗 System"
                   : mode === "dark"   ? "🌞 Light"
                                       : "🌙 Dark";
    btn.setAttribute("data-mode", mode);
  };

  // получить текущий режим
  const getCurrentMode = () => {
    const stored = localStorage.getItem("theme"); // может быть 'dark'|'light' или null
    return stored ? stored : "system";
  };

  // начальная инициализация
  let mode = getCurrentMode();
  applyTheme(mode);

  // 2) Реагировать на изменение системной темы, если выбран режим 'system'
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (getCurrentMode() === "system") applyTheme("system");
  };
  try {
    // новые браузеры
    media.addEventListener("change", onSystemChange);
  } catch {
    // старые браузеры
    media.addListener(onSystemChange);
  }

  // 3) Переключатель по клику: System → Dark → Light → System...
  btn.addEventListener("click", () => {
    const order = ["system", "dark", "light"];
    const current = getCurrentMode();
    const next = order[(order.indexOf(current) + 1) % order.length];
    if (next === "system") {
      localStorage.removeItem("theme"); // system — не храним, чтобы слушать OS
    } else {
      localStorage.setItem("theme", next);
    }
    applyTheme(next);
  });

  // 4) Синхронизация между вкладками
  window.addEventListener("storage", (e) => {
    if (e.key === "theme") {
      const newMode = getCurrentMode();
      applyTheme(newMode);
    }
  });

  // вспомогательная: если кнопки нет в html — аккуратно вставим в navbar
  function ensureThemeToggleButton() {
    if (document.getElementById("themeToggle")) return;
    const nav = document.querySelector(".navbar .container, .navbar .container-fluid, .navbar");
    if (!nav) return;
    const btn = document.createElement("button");
    btn.id = "themeToggle";
    btn.className = "btn btn-outline-light ms-2";
    btn.type = "button";
    btn.textContent = "🌗 System";
    // положим справа от меню
    nav.appendChild(btn);
  }
}

