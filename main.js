// -- придумать лучший способ получать объект из toDoList
// -- если после редактирования задачи пользователь введет уже существующую - 
// - ошибка сохранения, добавить проверку 

const textInput = document.getElementById('input_text');
const addButton = document.getElementById('add_button');
const selectFilter = document.getElementById('input_select');
const containerList = document.getElementById('container__list');


let toDoList_Page = document.getElementById('todo');
let toDoList = [];
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

// render();

//---------------------------------------------------------
addButton.addEventListener('click', addNewTask);
// textInput.addEventListener('keypress', addByEnter);
// containerList.addEventListener('click', containerEvent);
// selectFilter.addEventListener('change', filterTasks);
//---------------------------------------------------------

const checkNullStr = (str) => {
  return !str.trim();
}

function currentTasks() {
  const num = document.getElementById('number');
  let active = 0;
  
  toDoList.forEach((item) => {
    if(!item.done) active++;
  })

  num.innerHTML = active;
}


function showToDo(e) {
  toDoList.forEach((item, index) => {
    item.id = index;

    const editButton = document.createElement('button');
    editButton.classList.add('buttons__edit');
    editButton.innerHTML = 'Edit';
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'X';
    deleteButton.classList.add('buttons__delete');

    const itemButtons = document.createElement('div');
    itemButtons.classList.add('item__buttons');
    itemButtons.prepend(editButton);
    itemButtons.prepend(deleteButton);

    const itemText = document.createElement('p');
    itemText.innerHTML = item.task;
    itemText.classList.add('item__text');

    const itemInput = document.createElement('input');
    itemInput.type = 'checkbox';
    itemInput.classList.add('item__check');

    if(item.done){
      itemText.classList.add('taskDone');
      itemInput.checked = true;
    }

    const liElement = document.createElement('li');
    liElement.classList.add('items__item');
    liElement.prepend(itemButtons);
    liElement.prepend(itemText);
    liElement.prepend(itemInput);

    toDoList_Page.replaceWith(liElement);


    // editButton.addEventListener('click', (e) => {
    //   ////
    //   remove(item.id)
    // })
  });
  currentTasks();
}

function addNewTask (e) {

  if (checkNullStr(textInput.value)) return;
  let newTask = {
    task: textInput.value,
    done: false,
    edit: false,
    id: ''
  };

  toDoList.push(newTask);
  showToDo(e);
  filterTasks();
  textInput.value = '';
  // saveLocalStorage();
}

const editReturn = (item) => {
  let inputEdit = document.getElementById('input_edit').value;

  if(inputEdit == '' || checkNullStr(inputEdit)){
    return;
  }

  for (let i = 0; i < toDoList.length; i++) {
    if(inputEdit == toDoList[i].task){
      return;
    }
  }
  for (let i = 0; i < toDoList.length; i++) {
    if (toDoList[i].task == copyItem.innerHTML){
      toDoList[i].task = inputEdit;
    }
  }
    copyItem.innerHTML = inputEdit;
    item.replaceWith(copyItem);
    flag = false;
    saveLocalStorage();

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

      saveLocalStorage();
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
        }
        else if (item.task == value_ch && item.done) {
          item.done = false;
          text.classList.remove('taskDone');
          element.classList.remove('completed');
        }
      }
      saveLocalStorage();
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
  filterTasks();
}

function addByEnter (event){
    if (event.code == 'Enter' && textInput.value != '') {
      addNewTask();
    }
}

function filterTasks () {
  const todos = toDoList_Page.childNodes;
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