//Select DOM
const employeeNameInput = document.querySelector('[name = "employee"]');
const taskDescriptionInput = document.querySelector('[name = "task-desctiptnio"]');
const taskForm = document.querySelector("#taskForm");
const taskContainer = document.querySelector(".tasks");
const donedButton = document.querySelector(".tasks");
const deletedButton = document.querySelector(".delete-btn");
const allTasks = document.querySelector(".task-counter__number");
const completeTasks = document.querySelector(".complete-task");
const incompleteTasks = document.querySelector(".incomplete-task");
const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector("#optionsContainer");
const searchBox = document.querySelector(".search-box input");
const optionsList = document.querySelectorAll(".option");
const filterOption = document.querySelectorAll(".filter__button");
const errorTextAreaError = document.querySelector("#task__text-error");
const errorInputError = document.querySelector("#employee__input-error");
let taskIndex = 0;

//Event Listeners
document.addEventListener("DOMContentLoaded", getTasks);
taskForm.addEventListener("submit", addNewTask);
donedButton.addEventListener("click", deleteTodo);

filterOption.forEach((filter) => {
  filter.addEventListener("click", filterTask);
});
function addNewTask(e) {
  e.preventDefault();
  let proceed = true;
  if (employeeNameInput.value === "") {
    errorInputError.style.display = "block";
    selected.classList.add("invalid");
    proceed = false;
  } else {
    errorInputError.style.display = "none";
    selected.classList.remove("invalid");
  }
  if (taskDescriptionInput.value.length < 2) {
    errorTextAreaError.style.display = "block";
    taskDescriptionInput.classList.add("invalid");
    proceed = false;
  } else {
    errorTextAreaError.style.display = "none";
    taskDescriptionInput.classList.remove("invalid");
  }
  let employeeImg;
  switch (employeeNameInput.value) {
    case "Adam Nowak":
      employeeImg = 1;
      break;
    case "Michał Potoczek":
      employeeImg = 2;
      break;
    case "Antoni Worek":
      employeeImg = 3;
  }

  if (proceed) {
    const today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    taskDate = dd + "." + mm + "." + yyyy;
    const taskId = checkTaskIndex();
    //Save to local
    var taskObject = {
      taskId: taskId,
      employeeNameInput: employeeNameInput.value,
      taskDescriptionInput: taskDescriptionInput.value,
      taskDate: taskDate,
      employeeImg: employeeImg,
      done: 0,
    };

    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    taskDiv.setAttribute("data-id", taskId);

    const checkButton = document.createElement("button");
    checkButton.className = "task__done";
    checkButton.innerHTML = `<i class="fas fa-check-circle"></i>`;
    taskDiv.appendChild(checkButton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "task__delete";
    deleteButton.innerHTML = `<i class="fas fa-trash "></i>`;
    taskDiv.appendChild(deleteButton);

    const receiverDiv = document.createElement("div");
    receiverDiv.classList.add("task__receiver");

    const receiverImgDiv = document.createElement("div");
    receiverImgDiv.classList.add("task__img");
    receiverImgDiv.innerHTML = `<img src="./assets/employee${employeeImg}.png" alt="employee" />`;
    receiverDiv.appendChild(receiverImgDiv);

    const receiverNameDiv = document.createElement("div");
    receiverNameDiv.classList.add("task__name");
    receiverNameDiv.innerText = employeeNameInput.value;
    receiverDiv.appendChild(receiverNameDiv);
    taskDiv.appendChild(receiverDiv);

    const taskDateDiv = document.createElement("div");
    taskDateDiv.classList.add("task__date");
    taskDateDiv.innerText = taskDate;
    taskDiv.appendChild(taskDateDiv);

    const taskDescriptionDiv = document.createElement("div");
    taskDescriptionDiv.classList.add("task__descriptnion");
    taskDescriptionDiv.innerText = taskDescriptionInput.value;
    taskDiv.appendChild(taskDescriptionDiv);

    taskContainer.appendChild(taskDiv);
    employeeNameInput.value = "";
    taskDescriptionInput.value = "";

    saveLocalTasks(taskObject);
    countTask();
    resetFromValue();
  }
}

function deleteTodo(e) {
  const item = e.target;
  if (item.classList[0] === "task__delete") {
    const task = item.parentElement;
    removeLocalTasks(task);
    countTask();
    e.target.parentElement.remove();
  }
  if (item.classList[0] === "task__done") {
    const task = item.parentElement;
    setTaskToDone(task, item);
  }
}

function saveLocalTasks(task) {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function setTaskToDone(task, item) {
  let tasks;
  const taskIndex = task.dataset.id;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks[taskIndex].done === 0) {
      tasks[taskIndex].done = 1;
      item.classList.add("task-done");
      task.classList.add("completed");
    } else {
      tasks[taskIndex].done = 0;
      item.classList.remove("task-done");
      task.classList.remove("completed");
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  countTask();
}

function removeLocalTasks(task) {
  let tasks;
  const taskId = task.dataset.id;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  tasks.splice(taskId, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function checkTaskIndex() {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    return 0;
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    numberOfTaksks = tasks.length;
    return numberOfTaksks;
  }
}

function countTask() {
  let tasks;
  let completeTask = 0;
  if (localStorage.getItem("tasks") === null) {
    allTasks.innerText = 0;
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.forEach((task) => {
      if (task.done === 1) {
        completeTask += 1;
      }
    });
    allTasks.innerText = tasks.length;
    completeTasks.innerText = completeTask;
    incompleteTasks.innerText = tasks.length - completeTask;
  }
}

function getTasks() {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  tasks.forEach(function (task) {
    const taskDiv = document.createElement("div");
    taskDiv.className = `task ${task.done === 1 ? "completed" : ""}`;
    taskDiv.setAttribute("data-id", task.taskId);

    const checkButton = document.createElement("button");
    checkButton.className = `task__done ${task.done === 1 ? "task-done" : ""}`;
    checkButton.innerHTML = `<i class="fas fa-check-circle"></i>`;
    taskDiv.appendChild(checkButton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "task__delete";
    deleteButton.innerHTML = `<i class="fas fa-trash"></i>`;
    taskDiv.appendChild(deleteButton);

    const receiverDiv = document.createElement("div");
    receiverDiv.classList.add("task__receiver");

    const receiverImgDiv = document.createElement("div");
    receiverImgDiv.classList.add("task__img");
    receiverImgDiv.innerHTML = `<img src="./assets/employee${task.employeeImg}.png" alt="employee" />`;
    receiverDiv.appendChild(receiverImgDiv);

    const receiverNameDiv = document.createElement("div");
    receiverNameDiv.classList.add("task__name");
    receiverNameDiv.innerText = task.employeeNameInput;
    receiverDiv.appendChild(receiverNameDiv);
    taskDiv.appendChild(receiverDiv);

    const taskDateDiv = document.createElement("div");
    taskDateDiv.classList.add("task__date");
    taskDateDiv.innerText = task.taskDate;
    taskDiv.appendChild(taskDateDiv);

    const taskDescriptionDiv = document.createElement("div");
    taskDescriptionDiv.classList.add("task__descriptnion");
    taskDescriptionDiv.innerText = task.taskDescriptionInput;
    taskDiv.appendChild(taskDescriptionDiv);

    taskContainer.appendChild(taskDiv);
  });
  countTask();
}

//Select Employee

selected.addEventListener("click", () => {
  optionsContainer.classList.toggle("active");

  searchBox.value = "";
  filterList("");

  if (optionsContainer.classList.contains("active")) {
    searchBox.focus();
  }
});

optionsList.forEach((o) => {
  o.addEventListener("click", () => {
    selected.innerHTML = o.querySelector("label").innerHTML;
    employeeNameInput.value = o.querySelector("label").innerHTML;
    const elements = o.parentNode.childNodes;
    elements.forEach((element) => {
      if (element.classList !== undefined) {
        element.classList.remove("active");
      }
    });
    o.classList.add("active");
    optionsContainer.classList.remove("active");
  });
});

searchBox.addEventListener("keyup", function (e) {
  filterList(e.target.value);
});

function filterList(searchTerm) {
  searchTerm = searchTerm.toLowerCase();
  optionsList.forEach((option) => {
    let label = option.firstElementChild.nextElementSibling.innerText.toLowerCase();
    if (label.indexOf(searchTerm) != -1) {
      option.style.display = "flex";
    } else {
      option.style.display = "none";
    }
  });
}

function resetFromValue() {
  selected.innerText = "Pracownik";
  optionsList.forEach((o) => {
    if (o.classList.contains("active")) {
      o.classList.remove("active");
    }
  });
}

function filterTask(e) {
  const tasks = donedButton.childNodes;
  const status = e.target.dataset.status;
  tasks.forEach(function (task) {
    switch (status) {
      case "all":
        task.style.display = "block";
        break;
      case "completed":
        if (task.classList.contains("completed")) {
          task.style.display = "block";
        } else {
          task.style.display = "none";
        }
        break;
      case "incompleted":
        if (!task.classList.contains("completed")) {
          task.style.display = "block";
        } else {
          task.style.display = "none";
        }
    }
  });
}
