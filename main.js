// -- придумать лучший способ получать объект из toDoList
// -- если после редактирования задачи пользователь введет уже существующую - 
// - ошибка сохранения, добавить проверку 

const textInput = document.getElementById('input_text');
const addButton = document.getElementById('add_button');
const selectFilter = document.getElementById('input_select');
const containerList = document.getElementById('container__list');


let toDoList_page = document.getElementById('todo');
let toDoList = [];
let itemsDone = 0;
let copyItem = '';
let flag = false;


//---------------------------------------------------------
const render = () => {
  //  LocalStorage для сохранение инфы на локал сервере
  if (localStorage.getItem('todo')) {
    toDoList = JSON.parse(localStorage.getItem('todo'));
    showToDo();
  };
  if(localStorage.getItem('filter')) {
    selectFilter.value = JSON.parse(localStorage.getItem('filter'));
    filterTasks();
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

const checkNullStr = (str) => {
  const pattern = /^[\s]+$/;

  if (pattern.test(str)){
    return true;
  }

  return false;
}

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
            <div class="item__buttons">
              <button class="buttons__edit">Edit</button>
              <button class="buttons__delete">X</button>
            </div>
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

  if (textInput.value == '' || checkNullStr(textInput.value)) return;

  let newTask = {
    task: textInput.value,
    done: false
  };

  toDoList.push(newTask);
  showToDo();
  filterTasks();
  textInput.value = '';
  saveLocalStorage();
}

const editReturn = (item) => {
  let inputEdit = document.getElementById('input_edit').value;

  for (let i = 0; i < toDoList.length; i++) {
    if (toDoList[i].task == copyItem.innerHTML){
      toDoList[i].task = inputEdit;
    }
  }
    copyItem.innerHTML = inputEdit;
    item.replaceWith(copyItem);
    flag = false;
}

const editReturnEnter = (event) => {
  if (event.code == 'Enter' ) {
    editReturn(event.target.closest('.item__text'));
  }

  saveLocalStorage();
}

function containerEvent (event) {
  switch (event.target.className) {

    case 'buttons__delete':
      let item = event.target.closest('.items__item');
      item.remove();

      const value = item.children[1].innerHTML;

      for (let i = 0; i < toDoList.length; i++) {
        if (toDoList[i].task == value){
          toDoList.splice(i,1);
        }
      }

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
      
      break;
    case 'buttons__edit':

      let textItem = event.target.closest('.item__buttons').previousElementSibling;

      if(!flag){
        flag = true;

        copyItem = textItem.cloneNode(true);
        
        textItem.innerHTML = `<input id="input_edit" type="text" class="input_edit">`;

        textItem.addEventListener('keypress', editReturnEnter);
      }
      else{
        textItem.removeEventListener('keypress', editReturnEnter);
        editReturn(textItem);
      }
      break;
    default: return;
  }
  currentTasks();
  saveLocalStorage();
  filterTasks();
}

function addByEnter (event){
    if (event.code == 'Enter' && textInput.value != '') {
      addNewTask();
    }
}

function filterTasks () {
  const todos = toDoList_page.childNodes;
  todos.forEach((todo) => {
    if(todo.nodeName != "#text"){
      switch(selectFilter.value) {
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