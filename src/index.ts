import { v4 as uuidV4 } from "uuid";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

let taskIdHolder: string = "";

const list = document.querySelector<HTMLUListElement>("#list");
const form = document.getElementById("task_form") as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>(".new_task");
let arrayTaks: Task[] = loadTasks();

arrayTaks.forEach(addListItem);

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("this list", list);

  if (input?.value == "" || input?.value == null) return;

  if(taskIdHolder) {
    const [newTask] = arrayTaks.filter((el: Task) => el.id === taskIdHolder);
    addListItem(newTask);
    return;
  }

  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  };

  arrayTaks.push(newTask);
  saveTasks();

  addListItem(newTask);
  input.value = "";
});

function addListItem(task: Task) {
  if (taskIdHolder) {
    updateTask(task);
    return;
  }

  const item = document.createElement("li");
  const pTag = document.createElement("p");
  const action_btns = document.createElement("div");
  const delBtn = document.createElement("button");
  const editBtn = document.createElement("button");
  const label = document.createElement("label");
  const checkbox = document.createElement("input");

  item.classList.add("task");
  action_btns.classList.add("action_btns");
  delBtn.classList.add("delete_btn");
  editBtn.classList.add("edit_btn");
  label.classList.add("done_label");
  label.htmlFor = task.id;

  checkbox.id = task.id;
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;

  pTag.innerHTML = task.title;
  delBtn.innerHTML = "X";
  editBtn.innerHTML = "+";

  action_btns.append(delBtn, editBtn);
  label.append(checkbox, checkbox.checked ? "Done" : "Mark as Done");

  delBtn.addEventListener("click", () => deleteTask(item, task));
  editBtn.addEventListener("click", () => {
    input?.value = task.title;
    taskIdHolder = task.id;
  });

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    checkTask(task);
  });

  item.append(pTag, action_btns, label);
  list?.append(item);
}

const deleteTask = (domEl: Element, task: Task) => {
  domEl.remove();
  const localTasks = localStorage.getItem("localTask");
  if (!localTasks) return;

  arrayTaks = JSON.parse(localTasks).filter((el: Task) => el.id !== task.id);

  saveTasks();
};

const updateTask = (newTask: Task) => {
  arrayTaks.forEach((task: Task) => {
    if (task.id === taskIdHolder) {
      task.title = newTask.title;
    }
  });

  const pTag = document.getElementById(taskIdHolder) as HTMLParagraphElement;

  pTag.innerHTML = newTask.title;
  taskIdHolder = "";
  saveTasks();
};

const checkTask = (task: Task) => {
  arrayTaks.forEach((el: Task) => {
    if (el.id === task.id) el.completed = task.completed;
  });

  saveTasks();
};

function saveTasks() {
  localStorage.setItem("localTask", JSON.stringify(arrayTaks));
}

function loadTasks(): Task[] {
  const localTask = localStorage.getItem("localTask");
  if (!localTask) return [];

  return JSON.parse(localTask);
}
