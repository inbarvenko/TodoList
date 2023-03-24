// Редактирование задач.

// -- проверить на поле из пробелов
// -- придумать лучший способ получать обхект из toDoList
// -- в фильтре выполненых, если поставить на активную - не пропадет


const textInput = document.getElementById('input_text');
const addButton = document.getElementById('add_button');
const selectFilter = document.getElementById('input_select');
const containerList = document.getElementById('container__list');

let toDoList_page = document.getElementById('todo');
let toDoList = [];
let itemsDone = 0;


//---------------------------------------------------------
const render = () => {
  //  LocalStorage для сохранение инфы на локал сервере
  if (localStorage.getItem('todo')) {
    toDoList = JSON.parse(localStorage.getItem('todo'));
    showToDo();
  };
  if(localStorage.getItem('filter')) {
    selectFilter.value = JSON.parse(localStorage.getItem('filter'));
  }
}

const saveLocalStorage = () => {
  localStorage.setItem('todo', JSON.stringify(toDoList));
  localStorage.setItem('filter', JSON.stringify(selectFilter.value));
}

render();

//---------------------------------------------------------
addButton.addEventListener('click', addNewTask);
textInput.addEventListener('keypress', addByEnter);
containerList.addEventListener('click', containerEvent);
selectFilter.addEventListener('change', filterTasks);
//---------------------------------------------------------


function currentTasks() {
  const num = document.getElementById('number');
  let completed = 0;

  const todos = toDoList_page.childNodes;
  todos.forEach((todo) => {
    if(todo.nodeName != "#text"){
      if(todo.classList.contains("completed")) {
        completed++;
      }
    }
  });

  num.innerHTML = toDoList.length - completed;
}


function showToDo() {
  let strItem = '';
  toDoList.forEach((item, index) => {
    strItem += `
        <li class="items__item ${item.done ? 'completed' : ''}">
            <input id="item_${index}" type="checkbox" class="item__check" ${item.done ? 'checked' : ''}>
            <p for="item_${index}" class="item__text ${item.done ? 'taskDone' : ''}">${item.task}</p>
            <button class="item__delete-button">X</button>
        </li>
        `;
    toDoList_page.innerHTML = strItem;
  });
  currentTasks();
}

function addNewTask () {
  for (let item of toDoList) {
    if (item.task == textInput.value) {
      return;
    }
  }

  if (textInput.value == '') return;

  let newTask = {
    task: textInput.value,
    done: false
  };

  toDoList.push(newTask);
  showToDo();
  saveLocalStorage();
}

function containerEvent (event) {
  switch (event.target.className) {

    case 'item__delete-button':
      let item = event.target.closest('.items__item');
      item.remove();

      const value = item.children[1].innerHTML;

      toDoList.pop({ task: value });
      currentTasks()
     
      break;

    case 'item__check':

      let text = event.target.nextElementSibling;
      let element = event.target.closest('.items__item')

      let value_ch = text.innerHTML;
      for (let item of toDoList) {
        if (item.task == value_ch && !item.done) {
          item.done = true;
          text.classList.add('taskDone');
          element.classList.add('completed');

          itemsDone++;
        }
        else if (item.task == value_ch && item.done) {
          item.done = false;
          text.classList.remove('taskDone');
          element.classList.remove('completed');

          itemsDone--;
        }
      }

      currentTasks();
     
      break;
    default: return;
  }

  saveLocalStorage();
}

function addByEnter (event){
    if (event.code == 'Enter' && textInput.value != '') {
      addNewTask();
    }
}

function filterTasks (event) {
  const todos = toDoList_page.childNodes;
  todos.forEach((todo) => {
    if(todo.nodeName != "#text"){
      switch(event.target.value) {
        case "all": 
          todo.style.display = "flex";
          break;
        case "completed": 
          if(todo.classList.contains("completed")) {
            todo.style.display = "flex";
          } 
          else{
            todo.style.display = "none";
          }
          break;
        case "active":
          if(!todo.classList.contains("completed")) {
            todo.style.display = "flex";
          }
          else {
            todo.style.display = "none";
          }
          break;
      }
    }
  });

  saveLocalStorage();
}








class EventList {
  listeners = [];

  subscribe(cb) {
    if (this.listeners.includes(cb)) { return }
    this.listeners.push(cb)
  }

  notify(state) {
    this.listeners.forEach((listener) => {
      listener(state);
    })
  }

  remove(cb) {
    this.listeners = this.listeners.filter((listener) => listener !== cb);
  }
}