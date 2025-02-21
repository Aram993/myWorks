const $axios = axios.create ({
    baseURL: "http://localhost:3000"
});

const productsEl = document.querySelector(".products");
const categoryEl = document.querySelector("#categoryFilter");
const paginationEl = document.querySelector(".pagination");
const selectFilter = document.querySelector("#filter");

let limit = 8;
let page = 1;
let totalAmountOfProducts = 0;
let totalPages = 0;
let selectedSort = "_sort=price&_order=asc";

async function getProducts () {
    try {
        const response = await $axios.get(`/products?_expand=category&_page=${page}&_limit=${limit}&${selectedSort}`);
        totalAmountOfProducts = response.headers["x-total-count"];
        totalPages = Math.ceil(Number(totalAmountOfProducts / limit));
        renderProducts(response.data);
        renderPages();
    } catch(err) {
        console.log(err);
    };
}

async function getCategories () {
    try {
        const response = await $axios.get("/categories");
        renderCategories(response.data);
    } catch(err) {
        console.log(err);
    };
}

function renderProducts (products) {
    productsEl.textContent = "";
    products.forEach(product => {
        productsEl.innerHTML+= `<div class="card">
                            <img src="${product.image}" alt="${product.name}">
                            <h3>${product.name}</h3>
                            <p>${product.description}</p>
                            <p><strong>${product.category.name}</strong></p>
                            <p><strong>${product.price} $</strong></p>
                        </div>`
    });
    
}

function renderCategories (categories) {
    categories.forEach(category => {
        categoryEl.innerHTML += `<option value="${category.id}">${category.name}</option>`
    })
}

function renderPages () {
    paginationEl.textContent = "";
    for (let i = 1; i <= totalPages; i++) {
        paginationEl.innerHTML += `<button>${i}</button>`
    }

    const allButtons = paginationEl.querySelectorAll("button");
    allButtons.forEach(button => {
        button.addEventListener("click", async ()=> {
            page = button.textContent;
            await getProducts();
        })
    })
}

selectFilter.addEventListener("change", async ()=> {
    selectedSort = selectFilter.value;
    await getProducts();
})

async function initData() {
    await getProducts();
    await getCategories();
}

initData();