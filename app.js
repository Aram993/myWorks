const authorsURL = "http://localhost:3000/authors";
const booksURL = "http://localhost:3000/books";

const select = document.querySelector("#authors");
const container = document.querySelector(".container");
const pages = document.querySelectorAll(".page");
const cardsField = document.querySelector(".cards-field");
const skip = document.querySelectorAll(".skip");

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
        })
    })
}

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

select.addEventListener("change", ()=> {
    if (select.value === "0") {
        getBooks(1);
        skip.forEach(item => {
            item.style.display = "flex";
        });

    } else {
        const filteredBooks = booksArray.filter(book => {
            return book.authorId === Number(select.value);
        });

        skip.forEach(item => {
            item.style.display = "none";
        });
        
        renderBooks(authorsArray, filteredBooks);
    };
});