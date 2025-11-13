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
    // Обновленное регулярное выражение для проверки email
    if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) errors.push("Enter a valid email address.");
    if (pass.length < 6) errors.push("Password must be at least 6 characters.");
    if (pass !== conf) errors.push("Passwords do not match.");

    if (errors.length) {
      const ul = document.createElement("ul");
      errors.forEach(t => { const li = document.createElement("li"); li.textContent = t; ul.appendChild(li); });
      errEl.appendChild(ul);
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
// === THEME: auto (system) / light / dark ===========================
// Логика:
// 1) Если есть сохранённый выбор в localStorage('theme'): применяем его ('light'|'dark').
// 2) Если нет — следуем за системой (prefers-color-scheme).
// 3) Кнопка циклично меняет режим: System → Dark → Light → System...
function initTheme() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  const applyTheme = (mode) => {
    const body = document.body;

    // Удаляем все классы темы
    body.classList.remove("theme-dark");

    // Добавляем тёмную тему, если выбран Dark
    if (mode === "dark") {
      body.classList.add("theme-dark");
    } else if (mode === "system") {
      // Если система настроена на тёмную тему, применяем её
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        body.classList.add("theme-dark");
      }
    }

    // Обновляем текст на кнопке
    btn.textContent = mode === "system" ? "🌗 System"
                   : mode === "dark"   ? "🌞 Light"
                                       : "🌙 Dark";
    btn.setAttribute("data-mode", mode);
  };

  // Получаем текущую тему из LocalStorage или используем системную
  const getCurrentMode = () => {
    const stored = localStorage.getItem("theme"); // может быть 'dark'|'light' или null
    return stored ? stored : "system";
  };

  let mode = getCurrentMode();
  applyTheme(mode);

  // Переключение между режимами по клику
  btn.addEventListener("click", () => {
    const order = ["system", "dark", "light"];
    const current = getCurrentMode();
    const next = order[(order.indexOf(current) + 1) % order.length];
    if (next === "system") {
      localStorage.removeItem("theme"); // Убираем значение для системного режима
    } else {
      localStorage.setItem("theme", next); // Сохраняем выбранный режим
    }
    applyTheme(next);
  });

  // Синхронизация между вкладками
  window.addEventListener("storage", (e) => {
    if (e.key === "theme") {
      const newMode = getCurrentMode();
      applyTheme(newMode);
    }
  });
}
