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

