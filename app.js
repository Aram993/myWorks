const authorsURL = "http://localhost:3000/authors";
const booksURL = "http://localhost:3000/books";

const select = document.querySelector("#authors");
const container = document.querySelector(".container");
const pages = document.querySelectorAll(".page");
const cardsField = document.querySelector(".cards-field");
const input = document.querySelector("#inpt");

const authorsArray = [];
const booksArray = [];
async function getAuthors (URL) {
    try {
        const response = await axios.get(URL);
        authorsArray.push(...response.data);
        renderAuthors(select, authorsArray);
    } catch (error) {
        console.error(error);
    };
}

async function getAllBooks (URL) {
    try {
        const response = await axios.get(URL);
        booksArray.push(...response.data);
    } catch (error) {
        console.error(error);
    };
};

getAuthors(authorsURL);
getAllBooks(booksURL);
getBooks(1);

const renderAuthors = (element, array) => {
    array.forEach(item => {
        element.insertAdjacentHTML("beforeEnd", `<option value="${item.id}">${item.name}</option>`);
    });
};

async function getBooks (id) {
    try {
        const response = await axios.get(`http://localhost:3000/books?_page=${id}&_limit=4`);
        renderBooks(authorsArray, response.data);
    } catch (error) {
        console.error(error);
    }
}

function renderBooks (arr, arr2) {
    cardsField.textContent = "";
    arr.forEach(item => {
        arr2.forEach(value => {
            if (item.id === value.authorId) {
                cardsField.innerHTML += `   <div class="card">
                                                <div>${value.title}</div>
                                                <div>${item.name}</div>   
                                            </div>`
            }
        });
    });
};

pages.forEach(page => {
    page.addEventListener("click", ()=> {
        clearPageColor(pages);
        page.style.backgroundColor = "black";
        page.style.color = "white";
        getBooks(Number(page.textContent));
    });
});

function clearPageColor (arr) {
    arr.forEach(item => {
        item.style.backgroundColor = "white";
        item.style.color = "black";
    });
};

async function getSpecificBooks (id, value) {
    try {
        const response = await axios.get(`http://localhost:3000/books?q=${value}&_page=${id}&_limit=4`);
        renderBooks(authorsArray, response.data);
    } catch (error) {
        console.error(error);
    }
}

input.addEventListener("input", async ()=> {
    const response = await axios.get(`http://localhost:3000/books?q=${input.value}&_page=1&_limit=4`);
    const fullResponse = await axios.get(`http://localhost:3000/books?q=${input.value}`);
    renderBooks(authorsArray, response.data);
    console.log(response.data);
    skipPages(fullResponse.data);
    pages.forEach(page => {
        page.addEventListener("click", ()=> {
            clearPageColor(pages);
            page.style.backgroundColor = "black";
            page.style.color = "white";
            getSpecificBooks(Number(page.textContent), input.value);
        });
    });
});

select.addEventListener("change", async ()=> {
    
    const author = await filterAuthors(Number(select.value));
    const books = await filterBooks(Number(select.value));

    if (select.value === "0") {
        getBooks(1);
        pages.forEach(page => {
            page.style.display = "flex";
        });
    } else {
        skipPages(books);
        renderBooks(author, books);
    };
});

async function filterAuthors (id) {
    const response = await axios.get(`http://localhost:3000/authors?id=${id}`);
    return response.data;
}

async function filterBooks (id) {
    const response = await axios.get(`http://localhost:3000/books?authorId=${id}`);
    return response.data;
}

async function skipPages (array) {
    if (array.length <= 4) {
        showPages();
        pages.forEach((page, index) => {
            if (index > 0) {
                page.style.display = "none";
            };
        });

    } else if (array.length <= 8) {
        pages.forEach((page, index) => {
            showPages();
            if (index > 1) {
                page.style.display = "none";
            };
        });

    } else if (array.length <= 12) {
        showPages();
        pages.forEach((page, index) => {
            if (index > 2) {
                page.style.display = "none";
            };
        });

    } else if (array.length <= 16) {
        showPages();
        pages.forEach((page, index) => {
            if (index > 3) {
                page.style.display = "none";
            };
        });

    } else if (array.length <= 20) {
        showPages();
        pages.forEach((page, index) => {
            if (index > 4) {
                page.style.display = "none";
            };
        });

    } else if (array.length <= 24) {
        showPages();
        pages.forEach((page, index) => {
            if (index > 5) {
                page.style.display = "none";
            };
        });
    };
};

function showPages () {
    pages.forEach(page => {
        page.style.display = "flex";
    })
}
