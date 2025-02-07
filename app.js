const container = document.querySelector(".container");
const loader = document.querySelector(".load");
const UsersURL = fetch("https://dummyjson.com/users");

UsersURL
    .then(response => {
        if (!response.ok) {
            throw new Error("Ошибка запроса!");
        }
        return response.json();
    })
    .then(users => {
        const user = users.users;
        user.forEach(item => {
            renderUsers(container, item.firstName, item.lastName, item.age, item.address.city, item.address.state, item.image);
        })
    })
    .catch(err => {
        console.error(err)
    })
    .finally(()=> {
        loader.style.display = "none";
        container.style.display = "grid";
    })

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