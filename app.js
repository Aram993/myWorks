const wrapper = document.querySelector(".tasks");
const submitBtn = document.querySelector(".sbmt");
const taskInput = document.querySelector(".inpt");

async function getTasks () {
    const response = await axios.get("http://localhost:3000/tasks");
    const tasks = response.data;
    wrapper.textContent = "";
    tasks.forEach(task => {
        renderTasks(wrapper, task.date, task.name, task.done, task.id);
    });
};

getTasks();

function renderTasks (element, date, taskName, check, id) {
    const task = document.createElement("div");
    task.className = "task";
    task.innerHTML +=   `   
                            <span id="date">${date}</span>
                            <label for="${id}">${taskName}</label>
                            <input class="box" type="checkbox" id="${id}"${check ? "checked" : ""}>
                            <button class="del">Удалить</button>
                            <button class="edit">Изменить</button>
                        `
    element.append(task);
    const box = document.querySelectorAll(".box");
    box.forEach(item => {
        if (item.hasAttribute("checked")) {
            item.previousElementSibling.classList.add("line");
        } else {
            item.previousElementSibling.classList.remove("line");
        }
    });
};


submitBtn.addEventListener("click", (event)=> {
    event.preventDefault();
    postTasks(taskInput.value);
    getTasks();
    taskInput.value = "";
});

async function postTasks (value) {
    const response = await axios.post("http://localhost:3000/tasks", {name: value, date: new Date().toLocaleDateString(), done: false});
    console.log(response);
}