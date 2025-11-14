// Ambil elemen dari HTML
const form = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const dateInput = document.getElementById("date-input");
const todoList = document.getElementById("todo-list");
const filterInput = document.getElementById("filter-input");
const deadlineText = document.getElementById("deadline-text");

// Load data dari localStorage
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Event listeners
form.addEventListener("submit", addTodo);
filterInput.addEventListener("input", filterTodo);

// Render awal
renderTodos();
updateNearestDeadline();


// ------------------------------
//   TAMBAH TODO
// ------------------------------
function addTodo(e) {
  e.preventDefault();

  const task = todoInput.value.trim();
  const date = dateInput.value;

  if (!task || !date) {
    alert("Harap isi kegiatan dan tanggal!");
    return;
  }

  const todo = {
    id: Date.now(),
    task,
    date,
    completed: false
  };

  todos.push(todo);
  saveTodos();
  renderTodos();
  updateNearestDeadline();

  todoInput.value = "";
  dateInput.value = "";
}


// ------------------------------
//   SIMPAN KE LOCAL STORAGE
// ------------------------------
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}


function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach(todo => {
    const li = document.createElement("li");
    li.classList.add("todo-item");
    if (todo.completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

    const content = document.createElement("div");
    content.innerHTML = `
      <strong>${todo.task}</strong><br>
      <span>${new Date(todo.date).toLocaleDateString("id-ID")}</span>
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.classList.add("delete-btn");

    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
      updateNearestDeadline();
    });

    deleteBtn.addEventListener("click", () => {
      todos = todos.filter(t => t.id !== todo.id);
      saveTodos();
      renderTodos();
      updateNearestDeadline();
    });

    li.appendChild(checkbox);
    li.appendChild(content);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}


function filterTodo(e) {
  const keyword = e.target.value.toLowerCase();

  document.querySelectorAll(".todo-item").forEach(item => {
    const text = item.innerText.toLowerCase();
    item.style.display = text.includes(keyword) ? "flex" : "none";
  });
}


function updateNearestDeadline() {
  if (todos.length === 0) {
    deadlineText.textContent = "-";
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = todos
    .filter(t => {
      const tDate = new Date(t.date);
      tDate.setHours(0, 0, 0, 0);
      return !t.completed && tDate >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (upcoming.length === 0) {
    deadlineText.textContent = "Tidak ada deadline yang belum lewat 🎉";
  } else {
    const nearest = upcoming[0];
    const formattedDate = new Date(nearest.date).toLocaleDateString("id-ID");
    deadlineText.textContent = `${nearest.task} (${formattedDate})`;
  }
}
