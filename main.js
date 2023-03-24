const textInput = document.getElementById('input_text');
const addButton = document.getElementById('add_button');

let toDoList_page = document.getElementById('todo');

let toDoList = [];

const showToDo = () => {
    let strItem = '';
    toDoList.forEach((item, index) => {
         strItem += `
        <li>
            <input id="item_${index}" type="checkbox" ${item.done ? 'checked' : ''}>
            <p for="item_${index}">${item.task}</p>
        </li>
        `;
        toDoList_page.innerHTML = strItem;
    });
}

addButton.addEventListener("click", () => {
    let newTask = {
        task: textInput.value,
        done: false
    };

    toDoList.push(newTask);
    showToDo()
});