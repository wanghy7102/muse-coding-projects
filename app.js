// Muse Coding Projects — small tracker.
// Data is saved in this browser only, under the key below.
const STORAGE_KEY = "muse-coding-projects";

const STATUSES = ["idea", "building", "shipped"];
const NEXT_STATUS = { idea: "building", building: "shipped", shipped: null };
const PREV_STATUS = { idea: null, building: "idea", shipped: "building" };

const form = document.getElementById("project-form");

function loadProjects() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function render() {
  const projects = loadProjects();

  for (const status of STATUSES) {
    const list = projects.filter((p) => p.status === status);
    document.getElementById(`count-${status}`).textContent = String(list.length);

    const container = document.getElementById(`cards-${status}`);
    container.innerHTML = "";

    if (list.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "Nothing here yet.";
      container.appendChild(empty);
      continue;
    }

    for (const project of list) {
      const card = document.createElement("article");
      card.className = "card";

      const title = document.createElement("h3");
      title.textContent = project.name;
      card.appendChild(title);

      if (project.stack) {
        const stack = document.createElement("p");
        stack.className = "stack";
        stack.textContent = project.stack;
        card.appendChild(stack);
      }

      if (project.note) {
        const note = document.createElement("p");
        note.textContent = project.note;
        card.appendChild(note);
      }

      if (project.repo) {
        const link = document.createElement("a");
        link.href = project.repo;
        link.textContent = "Repo";
        link.target = "_blank";
        link.rel = "noreferrer";
        card.appendChild(link);
      }

      const actions = document.createElement("div");
      actions.className = "actions";

      if (PREV_STATUS[project.status]) {
        const back = document.createElement("button");
        back.type = "button";
        back.textContent = "Move back";
        back.addEventListener("click", () => moveProject(project.id, PREV_STATUS[project.status]));
        actions.appendChild(back);
      }

      if (NEXT_STATUS[project.status]) {
        const forward = document.createElement("button");
        forward.type = "button";
        forward.textContent = "Move forward";
        forward.addEventListener("click", () => moveProject(project.id, NEXT_STATUS[project.status]));
        actions.appendChild(forward);
      }

      const edit = document.createElement("button");
      edit.type = "button";
      edit.textContent = "Edit name";
      edit.addEventListener("click", () => editProject(project.id));
      actions.appendChild(edit);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "danger";
      remove.textContent = "Delete";
      remove.addEventListener("click", () => deleteProject(project.id));
      actions.appendChild(remove);

      card.appendChild(actions);
      container.appendChild(card);
    }
  }
}

function moveProject(id, status) {
  const projects = loadProjects().map((p) => (p.id === id ? { ...p, status } : p));
  saveProjects(projects);
  render();
}

function editProject(id) {
  const projects = loadProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) return;

  const name = window.prompt("Project name", project.name);
  if (name === null || name.trim() === "") return;

  saveProjects(projects.map((p) => (p.id === id ? { ...p, name: name.trim() } : p)));
  render();
}

function deleteProject(id) {
  const projects = loadProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) return;
  if (!window.confirm(`Delete "${project.name}"?`)) return;

  saveProjects(projects.filter((p) => p.id !== id));
  render();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  if (!name) return;

  const projects = loadProjects();
  projects.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    stack: document.getElementById("stack").value.trim(),
    status: document.getElementById("status").value,
    repo: document.getElementById("repo").value.trim(),
    note: document.getElementById("note").value.trim(),
    createdAt: new Date().toISOString(),
  });

  saveProjects(projects);
  form.reset();
  render();
});

render();
