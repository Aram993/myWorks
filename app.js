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

async function getData () {
    try {
        const response = await axios.get("http://localhost:3000/tasks");
        return response.data;
    } catch (error) {
        console.error(error);
    };
};

async function getTasks () {
    try {
        const tasks = await getData();
        wrapper.textContent = "";
        tasks.forEach(task => {
            renderTasks(wrapper, task.date, task.name, task.done, task.id);
        });
    } catch (error) {
        console.error(error);
    };
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
    const delBtn = document.querySelectorAll(".del");
    const editBtn = document.querySelectorAll(".edit");
    box.forEach(item => {
        if (item.hasAttribute("checked")) {
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
        });
    });

    delBtn.forEach(btn => {
        btn.addEventListener("click", async ()=> {
            const taskId = btn.previousElementSibling.id;
            await delTasks(taskId);
            await getTasks();
        });
    });

    editBtn.forEach(item => {
        item.addEventListener("click", ()=> {
            modalName.value = item.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
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
        await postTasks(taskInput.value);
        await getTasks();
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