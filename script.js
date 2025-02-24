const $axios = axios.create({
    baseURL: "http://localhost:3000"
})

const authorsEl = document.querySelector("#authors");
const cardsField = document.querySelector(".cards-field");
const paginationEl = document.querySelector("#pagination");
const priceEl = document.querySelector("#price");
const searchInput = document.querySelector("#inpt");
const limitInputs = document.querySelector(".limit");

let page = 1;
let limit = 4;
let sortedPrice = "0";
let authorsFilter = "0";
let authorsFilterValue;
let searchValue = "";

async function getAuthors () {
    try {
        const response = await $axios.get("/authors");
        renderAuthors(response.data);
    } catch (err) {
        console.error(err);
    }
}

async function getBooks () {
    try {
        const response = await $axios.get(`/books?_expand=author&_page=${page}&_limit=${limit}${(sortedPrice.length > 1) ? sortedPrice : ""}${(Number(authorsFilter) !== 0) ? authorsFilterValue : ""}&title_like=${searchValue}`);
        const totalBooks = response.headers["x-total-count"];
        const totalPages = Math.ceil(Number(totalBooks) / limit);

        renderBooks(response.data);
        getPages(totalPages);
    } catch (err) {
        console.error(err);
    }
}

function renderAuthors (authors) {
    authors.forEach(author => {
        authorsEl.innerHTML += `<option value="${author.id}">${author.name}</option>`;
    })
}

authorsEl.addEventListener("change", async ()=> {
    try {
        page = 1;
        authorsFilter = authorsEl.value;
        authorsFilterValue = `&authorId=${authorsFilter}`
        await getBooks();
    } catch (err) {
        console.error(err);
    }
})

function renderBooks (books) {
    cardsField.textContent = "";

    if (books.length === 0) {
        cardsField.innerHTML = `    <div class="card">
                                        <div>Книга не найдена</div>
                                    </div>`
    }

    books.forEach(book => {
        cardsField.innerHTML += `   <div class="card">
                                        <div>${book.title}</div>
                                        <div>${book.price}₽</div>
                                        <div>${book.author.name}</div>
                                    </div>`
    })
}

function getPages (total) {
    paginationEl.textContent = "";

    for (let i = 1; i <= total; i++) {
        paginationEl.innerHTML += `<div class="page ${(page === i) ? "active" : ""}">${i}</div>`;
    }

    const pageEl = paginationEl.querySelectorAll(".page");
    pageEl.forEach(pageBtn => {
        pageBtn.addEventListener("click", async ()=> {
            try {
                page = Number(pageBtn.textContent);
                await getBooks();
            } catch (err) {
                console.error(err);
            }
        })
    })
}

priceEl.addEventListener("change", async ()=> {
    try {
        page = 1;
        sortedPrice = priceEl.value;
        await getBooks();
    } catch (err) {
        console.error(err);
    }
})

searchInput.addEventListener("input", async ()=> {
    page = 1;
    searchValue = searchInput.value;
    await getBooks();
})

limitInputs.querySelectorAll("input").forEach(inpt => {
    inpt.addEventListener("change", async ()=> {
        page = 1;
        limit = Number(inpt.value);
        await getBooks();
    })
})

async function initData () {
    try {
        await getAuthors();
        await getBooks();
    } catch (err) {
        console.error(err);
    }
}

initData();
