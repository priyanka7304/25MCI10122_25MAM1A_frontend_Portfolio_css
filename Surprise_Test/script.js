let tasks = JSON.parse(localStorage.getItem("smart_todos") || "[]");
let currentFilter = "all";
let currentSort = null;

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function save() {
  localStorage.setItem("smart_todos", JSON.stringify(tasks));
}

function addTask() {
  const title = document.getElementById("taskInput").value.trim();
  const priority = document.getElementById("prioritySelect").value;
  const deadline = document.getElementById("deadlineInput").value;
  const errorEl = document.getElementById("formError");

  if (!title) {
    errorEl.classList.remove("d-none");
    return;
  }
  errorEl.classList.add("d-none");

  const task = {
    id: Date.now(),
    title,
    priority,
    deadline,
    completed: false,
  };

  tasks.unshift(task);
  save();

  document.getElementById("taskInput").value = "";
  document.getElementById("deadlineInput").value = "";
  document.getElementById("prioritySelect").value = "Medium";

  debouncedRender();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    save();
    debouncedRender();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  save();
  debouncedRender();
}

function setFilter(filter) {
  currentFilter = filter;
  ["all", "pending", "completed"].forEach((f) => {
    const btn = document.getElementById(`filter-${f}`);
    btn.classList.toggle("active", f === filter);
  });
  debouncedRender();
}

function setSort(sort) {
  currentSort = currentSort === sort ? null : sort;
  ["priority", "deadline"].forEach((s) => {
    const btn = document.getElementById(`sort-${s}`);
    btn.classList.toggle("btn-secondary", s === currentSort);
    btn.classList.toggle("btn-outline-secondary", s !== currentSort);
  });
  debouncedRender();
}

const priorityOrder = { High: 0, Medium: 1, Low: 2 };

function getVisible() {
  let list = [...tasks];

  if (currentFilter === "completed") list = list.filter((t) => t.completed);
  if (currentFilter === "pending") list = list.filter((t) => !t.completed);

  if (currentSort === "priority") {
    list.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } else if (currentSort === "deadline") {
    list.sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
  }

  return list;
}

function isOverdue(deadline, completed) {
  if (!deadline || completed) return false;
  return new Date(deadline) < new Date(new Date().toDateString());
}

function priorityBadge(priority) {
  const map = { High: "danger", Medium: "warning", Low: "success" };
  return `<span class="badge bg-${map[priority]}">${priority}</span>`;
}

function render() {
  const list = getVisible();
  const container = document.getElementById("taskList");

  document.getElementById("countTotal").textContent = tasks.length;
  document.getElementById("countDone").textContent = tasks.filter(
    (t) => t.completed,
  ).length;
  document.getElementById("countPending").textContent = tasks.filter(
    (t) => !t.completed,
  ).length;

  if (list.length === 0) {
    const msg =
      currentFilter === "completed"
        ? "No completed tasks."
        : currentFilter === "pending"
          ? "No pending tasks."
          : "No tasks yet. Add one above!";
    container.innerHTML = `<div class="alert alert-info">${msg}</div>`;
    return;
  }

  container.innerHTML = list
    .map((t) => {
      const overdue = isOverdue(t.deadline, t.completed);
      const titleClass = t.completed ? "completed-task" : "";
      const cardClass = overdue ? "overdue-task" : "";
      const deadlineStr = t.deadline
        ? `<small class="text-${overdue ? "danger" : "muted"}">
           <i class="fa fa-calendar" aria-hidden="true"></i>
 ${t.deadline}${overdue ? ' <span class="badge bg-danger">Overdue</span>' : ""}
         </small>`
        : "";

      return `
      <div class="card mb-2 shadow-sm ${cardClass}">
        <div class="card-body py-2 d-flex align-items-center gap-3">

         
          <input type="checkbox" class="form-check-input mt-0 flex-shrink-0"
            ${t.completed ? "checked" : ""}
            onchange="toggleTask(${t.id})" />

         
          <div class="flex-grow-1">
            <span class="${titleClass} fw-semibold">${escapeHTML(t.title)}</span>
            <div class="d-flex flex-wrap gap-2 mt-1 align-items-center">
              ${priorityBadge(t.priority)}
              ${deadlineStr}
            </div>
          </div>

         
          <button class="btn btn-sm btn-outline-danger flex-shrink-0 " onclick="deleteTask(${t.id})"><i class="fas fa-trash "></i></button>

        </div>
      </div>`;
    })
    .join("");
}

function escapeHTML(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const debouncedRender = debounce(render, 300);

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("taskInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
  });
  render();
});
