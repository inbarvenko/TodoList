const textInput = document.getElementById('input_text');
const addButton = document.getElementById('add_button');

let toDoList_page = document.getElementById('todo');

let toDoList = [];


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
}

// -- LocalStorage для сохранение инфы на локал сервере
localStorage.setItem('todo', JSON.stringify(toDoList));
if(localStorage.getItem('todo')){
    toDoList = JSON.parse(localStorage.getItem('todo'));
    showToDo();
};

const addNewTask = () => {
    // -- проверка на сущестование такого таска

    let newTask = {
        task: textInput.value,
        done: false
    };

    toDoList.push(newTask);
    showToDo();
}

addButton.addEventListener('click', () => addNewTask());

textInput.addEventListener('keypress', (event) => {
    // -- проверить на поле из пробелов
    if(event.code == 'Enter' && textInput.value != ''){
        addNewTask();
    }
});


const containerList = document.querySelector('.container__list');

containerList.addEventListener('click', (event) => {
    if (event.target.className != 'item__delete-button') return;

    let item = event.target.closest('.items__item');
    item.remove();

    const value = item.children[1].innerHTML;
    
    toDoList.pop({task: value});
});
