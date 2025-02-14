const wrapper = document.querySelector(".tasks");
const submitBtn = document.querySelector(".sbmt");
const taskInput = document.querySelector(".inpt");
const modalClose = document.querySelector(".modalClose");
const modalButton = document.querySelector(".modal-button");
const modal = document.querySelector(".modalBackground");
const modalName = document.querySelector("#t");
const modalDate = document.querySelector("#m");
const contactChoice1 = document.querySelector("#contactChoice1");
const contactChoice2 = document.querySelector("#contactChoice2");

const tasksArray = [];

//fetchTasks()
async function getData () {
    try {
        const response = await axios.get("http://localhost:3000/tasks");
        return response.data;
    } catch (error) {
        console.error(error);
    };
};

//renderInitialTasks()
async function getTasks () {
    try {
        
        const tasks = await getData();
        tasksArray.push(...tasks);
        wrapper.textContent = "";
        renderTasks();
    } catch (error) {
        console.error(error);
    };
};

getTasks();



//renderTaks()
function renderTasks () {
    wrapper.textContent = '';
    tasksArray.forEach(item => {
        const task = document.createElement("div");
        task.className = "task";
        task.innerHTML +=   `   
                                <span id="date">${item.date}</span>
                                <label for="${item.id}">${item.name}</label>
                                <input class="box" type="checkbox" id="${item.id}"${item.done ? "checked" : ""}>
                                <button class="del">Удалить</button>
                                <button class="edit">Изменить</button>
                            `
        wrapper.append(task);
    })
  
    const box = document.querySelectorAll(".box");
    const delBtn = document.querySelectorAll(".del");
    const editBtn = document.querySelectorAll(".edit");
    box.forEach(item => {
        if (item.checked) {
            item.previousElementSibling.classList.add("line");
        } else {
            item.previousElementSibling.classList.remove("line");
        }
    });

    box.forEach(item => {
        item.addEventListener("click", async ()=> {
            if (item.hasAttribute("checked")) {
                await change(item.getAttribute("id"), {done: false});
                await getTasks();
            } else {
                await change(item.getAttribute("id"), {done: true});
                await getTasks();
            };

            // await change(item.getAttribute("id"), {done: !item.checked});
            // await getTasks();
        });
    });

    delBtn.forEach(btn => {
        btn.addEventListener("click", async ()=> {
            const taskId = btn.previousElementSibling.id;
            let idx;
            await delTasks(taskId);
            tasksArray.forEach((task, index) => {
                if (task.id === Number(taskId)) {
                    idx = index;
                }
            });
            tasksArray.splice(idx, 1);
            renderTasks();
        });
    });

    editBtn.forEach(item => {
        item.addEventListener("click", ()=> {
            modalName.value = item.parentElement.querySelector('label').textContent;
            modalName.dataset.taskId = item.previousElementSibling.previousElementSibling.previousElementSibling.getAttribute("for");
            modalDate.value = item.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            modal.style.display = "block";
            if (item.previousElementSibling.previousElementSibling.hasAttribute("checked")) {
                contactChoice2.removeAttribute("checked");
                contactChoice1.setAttribute("checked" , "");
            } else {
                contactChoice1.removeAttribute("checked");
                contactChoice2.setAttribute("checked", "");
            };
        });
    });
};


submitBtn.addEventListener("click", async (event)=> {
    try {
        event.preventDefault();
        const newTask = await postTasks(taskInput.value);
        tasksArray.push(newTask);
        renderTasks();
        taskInput.value = "";
    } catch (error) {
        console.error(error);
    };
});

async function postTasks (value) {
    try {
        const dateNow = new Date().toLocaleDateString();
        const newDate = dateNow.split(".").reverse().join("-");
        const response = await axios.post("http://localhost:3000/tasks", {name: value, date: newDate, done: false});
        return response.data;
    } catch (error) {
        console.error(error);
    };
};

async function delTasks (id) {
    try {
        const response = await axios.delete(`http://localhost:3000/tasks/${id}`);
        return response;
    } catch (error) {
        console.error(error);
    };
}

modalClose.addEventListener("click", ()=> {
    modal.style.display = "none";
});

let radioBtn;
document.querySelectorAll('input[type="radio"][name="contact"]').forEach(radio => {
    radio.addEventListener('change', () => radioBtn = radio.value);
});

modalButton.addEventListener("click",async ()=> {
    await changeTask(modalName.dataset.taskId, {name: modalName.value, date: modalDate.value, done: radioBtn === "yes" ? true : false })
    await getTasks();
    modal.style.display = "none";
});

async function changeTask (id, object) {
    try {
        const response = await axios.put(`http://localhost:3000/tasks/${id}`, object);
        return response;
    } catch (error) {
        console.error(error);
    };
};

async function change (id, object) {
    try {
        const response = await axios.patch(`http://localhost:3000/tasks/${id}`, object);
        return response;
    } catch (error) {
        console.error(error);
    };
};