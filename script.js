const $axios = axios.create({
    baseURL: 'http://localhost:3000'
});

const productsEl = document.querySelector(".products");
const paginationEl = document.querySelector(".pagination");
const categoryContainer = document.querySelector("#categoryFilter");
const SortedValuesContainer = document.querySelector("#filter");

let page = 1;
let limit = 8;
let sortedValue = "&_sort=price&_order=asc"

async function getProducts() {
    try {
        const response = await $axios.get(`/products?_expand=category&_page=${page}&_limit=${limit}${sortedValue}`);
        const totalProducts = response.headers["x-total-count"];
        const numberOfPages = Math.ceil(totalProducts / limit);
        renderProducts(response.data);
        renderPages(numberOfPages);
    } catch (error) {
        console.error(error);
    }
}

async function getCategories() {
    try {
        const response = await $axios.get("/categories");
        renderCategories(response.data);
    } catch (error) {
        console.error(error);
    }
}

function renderProducts (products) {
    productsEl.textContent = "";

    products.forEach(product => {
        productsEl.innerHTML += `   <div class="card">
                                        <h3>${product.name}</h3>
                                        <p>${product.description}</p>
                                        <p><strong>${product.category.name}</strong></p>
                                        <p><strong>${product.price} $</strong></p>
                                    </div>`
    })
}

function renderPages (pages) {
    paginationEl.textContent = "";

    for (let i = 1; i <= pages; i++) {
        paginationEl.innerHTML += `<button class=${(page === i) ? "active" : ""}>${i}</button>`;
    }

    const paginationButton = paginationEl.querySelectorAll("button");

    paginationButton.forEach(button => {
        button.addEventListener("click", async ()=> {
            page = Number(button.textContent);
            await getProducts();
        })
    })
}

function renderCategories (categories) {
    categories.forEach(category => {
        categoryContainer.innerHTML +=`<option value="${category.id}">${category.name}</option>`
    })
}

SortedValuesContainer.addEventListener("change", async ()=> {
    sortedValue = SortedValuesContainer.value;
    getProducts();
})

initFunctions();

async function initFunctions () {
    try {
        await getProducts();
        await getCategories();
    } catch (error) {
        console.error(error);
    }
}