const container = document.querySelector(".container");
const loader = document.querySelector(".load");
const UsersURL = "https://dummyjson.com/users";

async function getUsers (URL) {
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error("Ошибка запроса!")
        }
        const data = await response.json();
        const users = data.users;
        users.forEach(item => {
            renderUsers(container, item.firstName, item.lastName, item.age, item.address.city, item.address.state, item.image);
        });
    } catch (err) {
        console.error(err);
    } finally {
        loader.style.display = "none";
        container.style.display = "grid";
    }
}

function renderUsers(element, name, lastName, year, city, state, image) {
    element.innerHTML += `<div class="inner">
                            <img src=${image} alt="${name}">
                            <div class="info">${name}</div>
                            <div class="info">${lastName}</div>
                            <div class="info">${year} year</div>
                            <div class="info">${city}</div>
                            <div class="info">${state}</div>
                        </div>`
}

getUsers(UsersURL);
