// Отображение количества активных задач.
// Фильтрация задач: все, только выполненные, только не выполненные.
// Редактирование задач.
// Сохранение задач и состояния фильтра при перезагрузке.

// -- вынести сохранение в отдельные функции
// -- проверить на поле из пробелов
// -- придумать лучший способ получать обхект из toDoList
// -- сохранять стиль для текста при перезагрузке (???) 


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


const textInput = document.getElementById('input_text');
const addButton = document.getElementById('add_button');

let toDoList_page = document.getElementById('todo');
let toDoList = [];
let itemsDone = 0;

const currentTasks = () => {
  const list = document.querySelector('.list__current');
  const num = document.querySelector('.number');
  if (num) {
    num.innerHTML= toDoList.length - itemsDone;
  }
  else list.insertAdjacentHTML('beforeend', `<h2 class="number">${toDoList.length - itemsDone}</h2>`);
}


const showToDo = () => {
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

//  LocalStorage для сохранение инфы на локал сервере
if (localStorage.getItem('todo')) {
  toDoList = JSON.parse(localStorage.getItem('todo'));
  showToDo();
};

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
          text.style.cssText = `
            color: grey;
            text-decoration: line-through;
          `;

          itemsDone++;
        }
        else if (item.task == value_ch && item.done) {
          item.done = false;
          text.style.cssText = '';

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
