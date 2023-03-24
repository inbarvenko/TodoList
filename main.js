// Отображение количества активных задач.
// Фильтрация задач: все, только выполненные, только не выполненные.
// Редактирование задач.
// Сохранение задач и состояния фильтра при перезагрузке.

// -- проверить на поле из пробелов
// -- придумать лучший способ получать обхект из toDoList
// -- сохранять стиль для текста done:true при перезагрузке (???)
// -- число действующих тасков неправильное ->
// при перезагрузке стр + сделанные таски = считает все, что есть 


const textInput = document.getElementById('input_text');
const addButton = document.getElementById('add_button');

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
}

render();

//---------------------------------------------------------

function currentTasks() {
  const list = document.querySelector('.list__current');
  const num = document.querySelector('.number');
  if (num) {
    num.innerHTML= toDoList.length - itemsDone;
  }
  else list.insertAdjacentHTML('beforeend', `<h2 id="number" class="number">${toDoList.length - itemsDone}</h2>`);
}


function showToDo() {
  let strItem = '';
  toDoList.forEach((item, index) => {
    strItem += `
        <li class="items__item">
            <input id="item_${index}" type="checkbox" class="item__check" ${item.done ? 'checked' : ''}>
            <p for="item_${index}" class="item__text">${item.task}</p>
            <button class="item__delete-button">X</button>
        </li>
        `;
    toDoList_page.innerHTML = strItem;
  });
  currentTasks();
}



const addNewTask = () => {

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
  localStorage.setItem('todo', JSON.stringify(toDoList));
}

addButton.addEventListener('click', () => addNewTask());

textInput.addEventListener('keypress', (event) => {
  if (event.code == 'Enter' && textInput.value != '') {
    addNewTask();
  }
});

const containerList = document.querySelector('.container__list');

const containerEvent = (event) => {
  switch (event.target.className) {

    case 'item__delete-button':
      let item = event.target.closest('.items__item');
      item.remove();

      const value = item.children[1].innerHTML;

      toDoList.pop({ task: value });
      currentTasks()
      localStorage.setItem('todo', JSON.stringify(toDoList));
      break;

    case 'item__check':

      let text = event.target.nextElementSibling;

      let value_ch = event.target.nextElementSibling.innerHTML;
      for (let item of toDoList) {
        if (item.task == value_ch && !item.done) {
          item.done = true;
          text.className = 'item__text taskDone';

          itemsDone++;
        }
        else if (item.task == value_ch && item.done) {
          item.done = false;
          text.className = 'item__text';

          itemsDone--;
        }
      }

      currentTasks();
      localStorage.setItem('todo', JSON.stringify(toDoList));
      break;
    default: return;
  }
}
containerList.addEventListener('click', containerEvent);



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