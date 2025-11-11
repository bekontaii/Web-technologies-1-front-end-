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
function initTodo() {
  const input = document.getElementById("todoInput");
  const addBtn = document.getElementById("addTodoBtn");
  const list = document.getElementById("todoList");
  const clearBtn = document.getElementById("clearDoneBtn");
  const removeLastBtn = document.getElementById("removeLastBtn");

  if (!input || !addBtn || !list) return;

  // --- LocalStorage helpers ---
  const saveTodos = () => {
    const data = [...list.querySelectorAll("li")].map(li => ({
      text: li.querySelector("span").textContent,
      done: li.querySelector("span").classList.contains("text-decoration-line-through")
    }));
    localStorage.setItem("todos", JSON.stringify(data));
  };

  const loadTodos = () => {
    const saved = JSON.parse(localStorage.getItem("todos") || "[]");
    list.innerHTML = "";
    saved.forEach(t => createItem(t.text, t.done));
  };

  // --- Создание новой задачи ---
  const createItem = (text, done = false) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center fade-in";
    const span = document.createElement("span");
    span.textContent = text;
    span.style.cursor = "pointer";

    if (done) span.classList.add("text-decoration-line-through", "text-muted");

    span.addEventListener("click", () => {
      span.classList.toggle("text-decoration-line-through");
      span.classList.toggle("text-muted");
      saveTodos();
    });

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-sm btn-outline-danger";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => { li.remove(); saveTodos(); });

    li.append(span, delBtn);
    list.appendChild(li);
    li.style.animation = "itemIn 0.4s ease";
  };

  // --- Добавление задачи ---
  const addItem = () => {
    const text = input.value.trim();
    if (!text) return alert("Task cannot be empty!");
    createItem(text);
    input.value = "";
    input.focus();
    saveTodos();
  };

  addBtn.addEventListener("click", addItem);
  input.addEventListener("keydown", e => e.key === "Enter" && addItem());

  clearBtn?.addEventListener("click", () => {
    list.querySelectorAll("span.text-decoration-line-through").forEach(s => s.closest("li")?.remove());
    saveTodos();
  });

  removeLastBtn?.addEventListener("click", () => {
    const items = list.querySelectorAll("li");
    if (items.length) items[items.length - 1].remove();
    saveTodos();
  });

  loadTodos();
}

// ==================== 4) Change Background Color ====================
function initBgColorChanger() {
  const btn = document.getElementById("bgColorBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const colors = ["#f8f9fa", "#fff3cd", "#e7f5ff", "#e8f5e9", "#fde2e4", "#eef2ff"];
    const pick = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.transition = "background-color 0.6s ease";
    document.body.style.backgroundColor = pick;
  });
}





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

