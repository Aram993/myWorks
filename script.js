const $axios = axios.create({
    baseURL: 'http://localhost:3000'
});

const productsEl = document.querySelector(".products");
const paginationEl = document.querySelector(".pagination");
const categoryContainer = document.querySelector("#categoryFilter");
const SortedValuesContainer = document.querySelector("#filter");
const searchInput = document.querySelector("#searchInput");
const limitsInput = document.querySelectorAll(".limitsInput");
const body = document.querySelector("body");
const loader = document.querySelector(".loader");

let page = 1;
let limit = 8;
let categoryId = "all";
let sortedValue = "&_sort=price&_order=asc";
let categoryValue = `&categoryId=${categoryId}`;
let searchValue = "";
let search = `&name_like=${searchValue}`;

async function getProducts() {
    try {
        loader.style.display = "block";

        const response = await $axios.get(`/products?_expand=category&_page=${page}&_limit=${limit}${sortedValue}${(isNaN(categoryId)) ? "" : categoryValue}${search}`);
        const totalProducts = response.headers["x-total-count"];
        const numberOfPages = Math.ceil(totalProducts / limit);
        renderProducts(response.data);
        renderPages(numberOfPages);
    } catch (error) {
        console.error(error);
    } finally {
        loader.style.display = "none";
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

    if (products.length === 0) {
        productsEl.innerHTML = `<p class="inpt">ТОВАРЫ НЕ НАЙДЕНЫ!</p>`;
    }

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
            try {
                loader.style.display = "block";

                page = Number(button.textContent);
                await getProducts();
            } catch(err) {
                console.error(err)
            } finally {
                loader.style.display = "none";
            }
        })
    })
}

function renderCategories (categories) {
    categories.forEach(category => {
        categoryContainer.innerHTML +=`<option value="${category.id}">${category.name}</option>`
    })
}

categoryContainer.addEventListener("change", async ()=> {
    try {
        loader.style.display = "block";

        page = 1;
        categoryId = Number(categoryContainer.value);
        categoryValue = `&categoryId=${categoryId}`;
        await getProducts();
    } catch (err) {
        console.error(err)
    } finally {
        loader.style.display = "none";
    }
})

SortedValuesContainer.addEventListener("change", async ()=> {
    try {
        loader.style.display = "block";
        page = 1;
        sortedValue = SortedValuesContainer.value;
        await getProducts();
    } catch (err) {
        console.error(err);
    } finally {
        loader.style.display = "none";
    }
})

searchInput.addEventListener("input", async ()=> {
    try {
        loader.style.display = "block";

        page = 1;
        searchValue = searchInput.value;
        search = `&name_like=${searchValue}`
        await getProducts();
    } catch (err) {
        console.error(err);
    } finally {
        loader.style.display = "none";
    }
    
})

limitsInput.forEach(input => {
    input.addEventListener("change", async ()=> {
        try {
            loader.style.display = "block";

            limit = Number(input.value);
            await getProducts();
        } catch (err) {
            console.error(err);
        } finally {
            loader.style.display = "none";
        }
    })
})

initFunctions();

async function initFunctions () {
    try {
        loader.style.display = "block";

        await getProducts();
        await getCategories();
    } catch (error) {
        console.error(error);
    } finally {
        loader.style.display = "none";
    }
}