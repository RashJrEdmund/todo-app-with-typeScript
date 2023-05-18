import { v4 as uuidV4 } from "uuid";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

const list = document.querySelector<HTMLUListElement>("#list");
const form = document.getElementById("task_form") as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>(".new_task");
let arrayTaks: Task[] = loadTasks();

arrayTaks.forEach(addListItem);

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("this list", list);

  if (
    input?.value == "" ||
    input?.value == null ||
    !/\d|\w/.test(input.value)
  ) {
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
  const item = document.createElement("li");
  const pTag = document.createElement("p");
  const delBtn = document.createElement("button");
  const label = document.createElement("label");
  const checkbox = document.createElement("input");

  item.classList.add("task");
  delBtn.classList.add("delete_btn");
  label.classList.add("done_label");
  label.htmlFor = task.id;

  checkbox.id = task.id;
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;

  pTag.innerHTML = task.title;
  delBtn.innerHTML = "X";

  label.append(checkbox, checkbox.checked ? "Done" : "Mark as Done");

  delBtn.addEventListener("click", () => deleteTask(item, task))

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    checkTask(task);
  });

  item.append(pTag, delBtn, label);
  list?.append(item);
}

const deleteTask = (domEl: Element, task: Task) => {
  domEl.remove();
  const localTasks = localStorage.getItem("localTask");
  if (!localTasks) return;

  arrayTaks = JSON.parse(localTasks).filter((el: Task) => el.id !== task.id);

  saveTasks();
};

const checkTask = (task: Task) => {
  arrayTaks.forEach((el: Task) => {
    if (el.id === task.id) el.completed = task.completed;
  });

  list.innerHTML = "";
  arrayTaks.forEach(addListItem);
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
