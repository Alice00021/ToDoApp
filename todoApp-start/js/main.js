// Находим на странице элемент с id = Form
const form = document.querySelector('#form');
//Находим и обращаемся к тому месту, где вводим задачу
const taskInput = document.querySelector('#taskInput');
// находим элемент со списком дел 
const tasksList = document.querySelector('#tasksList');
// Находим элемент "Спиоск дел пуст"
const emptyList = document.querySelector('#emptyList');

//массив, который будет содержать все задачи
let tasks = [];

if (localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((element) => renderTask(element));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

function addTask(event) {
    //отменим перезагрузку страницы при отправке формы
    event.preventDefault();
    //Достаем текст задачи из поля ввода
    const taskText = taskInput.value
  
    //Описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };
    //Добавляем задачу в массив с задачами
    tasks.push(newTask);

    saveToLocalStorage();
 
    renderTask(newTask);

    //очищаем поле ввода и возвращаем на него фокус
    taskInput.value = ""
    taskInput.focus();
    
    checkEmptyList();

}

function deleteTask(event) {
    if(event.target.dataset.action !== 'delete') return;
    
    // проверяем, что клип был по кнопке удалить

 
        const parentNode = event.target.closest('.list-group-item');
        const id = parentNode.id

        //находим индекс задачи в массиве
        const index= tasks.findIndex((task)=>  task.id == id);

        tasks.splice(index, 1);

       /*  //удаляем задачу через фильтрацию массива 
        tasks = tasks.filter((task)=> task.id !==id); */

        saveToLocalStorage();

        parentNode.remove();

        checkEmptyList();
}

function doneTask(event){
    if(event.target.dataset.action !== 'done') return;

    //проверяем, что клип был по "задача выполнена"

    const parentNode = event.target.closest('.list-group-item');

    const id = parentNode.id

    const task = tasks.find((task)=>task.id == id)
    task.done = !task.done

    console.log(task)

    const taskTitle1 = parentNode.querySelector('.task-title');

    saveToLocalStorage();

    taskTitle1.classList.toggle('task-title--done');
    console.log(taskTitle1);
    
}

function checkEmptyList() {
    if (tasks.length === 0){
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`;
     
    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }
    if (tasks.length > 0){
        const emptyListEL = document.querySelector('#emptyList');
        emptyListEL ? emptyListEL.remove() : null;
    }

}
function saveToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task){
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';
    //Формируем разметку для новой задачи
    const taskHTML = `
    <li id= "${task.id}"class="list-group-item d-flex justify-content-between task-item">
                    <span class="${cssClass}">${task.text}</span>
                    <div class="task-item__buttons">
                        <button type="button" data-action="done" class="btn-action">
                            <img src="./img/tick.svg" alt="Done" width="18" height="18">
                        </button>
                        <button type="button" data-action="delete" class="btn-action">
                            <img src="./img/cross.svg" alt="Done" width="18" height="18">
                        </button>
                    </div>
                </li>
    `;
    //добавляем задачу на страницу 
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}




