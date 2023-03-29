const selectFilter = document.getElementById('input_select');
const containerList = document.getElementById('container__list');
const textInput = document.getElementById('input_text');
const addButton = document.getElementById('add_button');

let toDoList_Page = document.getElementById('todo');
let toDoList = [];


//---------------------------------------------------------
const render = () => {
  //  LocalStorage для сохранение инфы на локал сервере
  if (localStorage.getItem('todo')) {
    toDoList = JSON.parse(localStorage.getItem('todo'));
  };
  if(localStorage.getItem('filter')) {
    selectFilter.value = JSON.parse(localStorage.getItem('filter'));
  }

  filterTasks();
  currentTasks();
}

const saveLocalStorage = () => {
  localStorage.setItem('todo', JSON.stringify(toDoList));
  localStorage.setItem('filter', JSON.stringify(selectFilter.value));
};

render();

//---------------------------------------------------------
addButton.addEventListener('click', addNewTask);
textInput.addEventListener('keypress', addByEnter);
selectFilter.addEventListener('change', filterTasks);
//---------------------------------------------------------

const withoutSpacesStr = (str) => {
  str = str.trim();
  return str;
}

function currentTasks() {
  const num = document.getElementById('number');
  let active = 0;
  
  toDoList.forEach((item) => {
    if(!item.done) active++;
  })

  num.innerHTML = active;
}

function addNewTask () {
  const str = withoutSpacesStr(textInput.value);
  if (!str) return;
  let newTask = {
    task: str,
    done: false,
    edit: false,
    id: ''
  };

  toDoList.push(newTask);
  filterTasks();
  textInput.value = '';
}

function addByEnter (event){
  if (event.code == 'Enter' && withoutSpacesStr(textInput.value)) {
    addNewTask();
  }
}

function removeTask(id) {
  toDoList.forEach((item) => {
    if(item.id == id) {
      toDoList.splice(id,1);
    }
  });

  filterTasks();
}

function editTask(id) {
  toDoList.forEach((item) => {
    if(item.id == id) {
      item.edit = !item.edit;
    }
  });

  filterTasks();
}

function completeTask (id) {
  toDoList.forEach((item) => {
    if(item.id == id) {
      item.done = !item.done;
    }
  });

  currentTasks();
  filterTasks();
}

function mouseOutInput (event) {
  if(!event.target.classList.contains('Edit')){
    toDoList.forEach((item) => {
      if(item.edit){
        editTask(item.id);
      }
    });

    document.removeEventListener('mousedown', mouseOutInput);
  }
}

function itemTextChange (item) {
  let itemText;
    if(item.edit){ 
      itemText = document.createElement('input');
      itemText.classList.add('Edit');
      itemText.value = item.task;

      itemText.addEventListener('input', (event) => {
        const str = withoutSpacesStr(event.target.value);

        if(str){
          item.task = str;
        }
      });

      itemText.addEventListener('keypress', (event) => {
        if (event.code == 'Enter') {
          editTask(item.id);
        }
      });

      document.addEventListener('mousedown', mouseOutInput);

    }
    else{
      itemText = document.createElement('p');
      itemText.innerHTML = item.task;
      itemText.classList.add('item__text');
    }

    return itemText;
};

function showToDo() {
  toDoList_Page.innerHTML = null;
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

    const itemText = itemTextChange(item);
    
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

    toDoList_Page.append(liElement);


    deleteButton.addEventListener('click', () => {
      removeTask(item.id);
    });

    editButton.addEventListener('click', () => {
      editTask(item.id);
    });

    itemInput.addEventListener('change', () => {
      completeTask(item.id);
    });

  });
  
  saveLocalStorage();
  currentTasks();
}

function showCompleted (){
  toDoList_Page.innerHTML = null;

  toDoList.forEach((item) => {
    if(item.done){
    
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

      const itemText = itemTextChange(item);
      
      const itemInput = document.createElement('input');
      itemInput.type = 'checkbox';
      itemInput.classList.add('item__check');

      itemText.classList.add('taskDone');
      itemInput.checked = true;

      const liElement = document.createElement('li');
      liElement.classList.add('items__item');
      liElement.prepend(itemButtons);
      liElement.prepend(itemText);
      liElement.prepend(itemInput);

      toDoList_Page.append(liElement);

      deleteButton.addEventListener('click', () => {
        removeTask(item.id);
      });
  
      editButton.addEventListener('click', () => {
        editTask(item.id);
      });
  
      itemInput.addEventListener('change', () => {
        completeTask(item.id);
      });
    }
  });
}

function showActive(){
  toDoList_Page.innerHTML = null;

  toDoList.forEach((item) => {
    if(!item.done){
    
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

      const itemText = itemTextChange(item);
      
      const itemInput = document.createElement('input');
      itemInput.type = 'checkbox';
      itemInput.classList.add('item__check');

      const liElement = document.createElement('li');
      liElement.classList.add('items__item');
      liElement.prepend(itemButtons);
      liElement.prepend(itemText);
      liElement.prepend(itemInput);

      toDoList_Page.append(liElement);

      deleteButton.addEventListener('click', () => {
        removeTask(item.id);
      });
  
      editButton.addEventListener('click', () => {
        editTask(item.id);
      });
  
      itemInput.addEventListener('change', () => {
        completeTask(item.id);
      });
    }
  });
}

function filterTasks () {
  saveLocalStorage();

  switch(selectFilter.value) {
    case "all": 
      showToDo();
      break;
    case "completed": 
      showCompleted();
      break;
    case "active":
      showActive();
      break;
  }
}