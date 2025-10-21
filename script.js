
// Shared JS for Assignment 4 components
document.addEventListener("DOMContentLoaded", () => {
  initDateTime();
  initContactForm();
  initTodo();
  initBgColorChanger();
  initSorter();
  initGuessGame();
});

// 6) Current Date & Time
function initDateTime() {
  const el = document.getElementById("dtNow");
  if (!el) return;
  function tick() {
    const now = new Date();
    // Format like: October 9, 2024, 10:45 AM
    const formatted = now.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
    el.textContent = formatted;
  }
  tick();
  setInterval(tick, 1000);
}

// 2) Form Validation
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

    const name = (nameEl.value || "").trim();
    const email = (emailEl.value || "").trim();
    const pass = passEl.value || "";
    const conf = confEl.value || "";

    if (!name) errors.push("Name is required.");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Enter a valid email.");
    if (pass.length < 6) errors.push("Password must be at least 6 characters.");
    if (pass !== conf) errors.push("Password confirmation does not match.");

    if (errors.length) {
      const ul = document.createElement("ul");
      errors.forEach(t => { const li = document.createElement("li"); li.textContent = t; ul.appendChild(li); });
      errEl.appendChild(ul);
      errEl.classList.remove("d-none");
    } else {
      errEl.classList.add("d-none");
      okEl.textContent = "Form is valid ✅";
      form.reset();
    }
  });
}

// 3) Interactive To-Do List + validation
function initTodo() {
  const input = document.getElementById("todoInput");
  const addBtn = document.getElementById("addTodoBtn");
  const list = document.getElementById("todoList");
  const clearBtn = document.getElementById("clearDoneBtn");
  const removeLastBtn = document.getElementById("removeLastBtn");

  if (!input || !addBtn || !list) return;

  function addItem() {
    const text = (input.value || "").trim();
    if (!text) {
      alert("Task cannot be empty");
      return;
    }
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    const span = document.createElement("span");
    span.textContent = text;
    span.style.cursor = "pointer";
    span.addEventListener("click", () => {
      span.classList.toggle("text-decoration-line-through");
      span.classList.toggle("text-muted");
    });
    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-sm btn-outline-danger";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => li.remove());

    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
    input.value = "";
    input.focus();
  }

  addBtn.addEventListener("click", addItem);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") addItem(); });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      list.querySelectorAll("span.text-decoration-line-through").forEach(s => s.closest("li")?.remove());
    });
  }

  if (removeLastBtn) {
    removeLastBtn.addEventListener("click", () => {
      const items = list.querySelectorAll("li");
      if (items.length) items[items.length - 1].remove();
    });
  }
}

// 5) Change Background Color
function initBgColorChanger() {
  const btn = document.getElementById("bgColorBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const colors = ["#f8f9fa", "#fff3cd", "#e7f5ff", "#e8f5e9", "#fde2e4", "#eef2ff"];
    const pick = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = pick;
  });
}

// 4) Number Sorting Tool
function initSorter() {
  const input = document.getElementById("numbersInput");
  const ascBtn = document.getElementById("ascBtn");
  const descBtn = document.getElementById("descBtn");
  const out = document.getElementById("sortResult");
  if (!input || !ascBtn || !descBtn || !out) return;

  function parseNumbers() {
    const raw = (input.value || "").trim();
    if (!raw) return null;
    // Split by commas or spaces
    const parts = raw.split(/[\s,]+/).filter(Boolean);
    const nums = parts.map(p => Number(p));
    if (nums.some(n => !Number.isFinite(n))) return "Only numbers are allowed (use spaces or commas).";
    return nums;
  }

  function render(nums) {
    out.textContent = nums.join(", ");
  }

  function handleSort(order) {
    const parsed = parseNumbers();
    if (parsed === null) { out.textContent = "Enter numbers first."; return; }
    if (typeof parsed === "string") { out.textContent = parsed; return; }
    const nums = parsed.slice().sort((a, b) => order === "asc" ? a - b : b - a);
    render(nums);
  }

  ascBtn.addEventListener("click", () => handleSort("asc"));
  descBtn.addEventListener("click", () => handleSort("desc"));
}

// 7) Optional: Random Number Guessing Game
let __target = null;
let __attempts = 0;

function initGuessGame() {
  const startBtn = document.getElementById("startGameBtn");
  const guessBtn = document.getElementById("guessBtn");
  const input = document.getElementById("guessInput");
  const msg = document.getElementById("gameMsg");
  const tries = document.getElementById("attempts");

  if (!startBtn || !guessBtn || !input || !msg || !tries) return;

  function resetGame() {
    __target = Math.floor(Math.random() * 100) + 1; // 1..100
    __attempts = 0;
    msg.textContent = "Game started! Guess a number between 1 and 100.";
    tries.textContent = "Attempts: 0";
    input.value = "";
    input.disabled = false;
    guessBtn.disabled = false;
    input.focus();
  }

  function handleGuess() {
    const val = Number(input.value);
    if (!Number.isInteger(val) || val < 1 || val > 100) {
      msg.textContent = "Enter an integer from 1 to 100.";
      return;
    }
    __attempts += 1;
    tries.textContent = "Attempts: " + __attempts;
    if (val === __target) {
      msg.textContent = "🎉 Correct! The number was " + __target + ". Attempts: " + __attempts;
      input.disabled = true;
      guessBtn.disabled = true;
    } else if (val > __target) {
      msg.textContent = "Too high. Try a smaller number.";
    } else {
      msg.textContent = "Too low. Try a bigger number.";
    }
    input.select();
  }

  startBtn.addEventListener("click", resetGame);
  guessBtn.addEventListener("click", handleGuess);
}
