const instance = axios.create({
    baseURL: 'http://localhost:3000/'
});

const select = document.querySelector("#authors");
const cardsField = document.querySelector(".cards-field");
const pagination = document.querySelector("#pagination");
const searchString = document.querySelector("#inpt");
const radioBtn = document.querySelectorAll(".radio");
const price = document.querySelector("#price");

let pageNumber = 1;
let limitOfBooks = 4;
let total = 0;


async function getAuthors () {
    try {
        const response = await instance.get("authors");
        renderAuthors(response.data);
    } catch (err) {
        console.error(err);
    }
};

async function getBooks (page, limitOfBooks, authorFilter = "", searchValue = "", priceValue = "") {
    try {
        const response = await instance.get(`books?_expand=author&_page=${page}&_limit=${limitOfBooks}&${authorFilter}&q=${searchValue}&${priceValue}`);
        total = response.headers["x-total-count"];
        renderBooks(response.data);
        renderPage()
    } catch (err) {
        console.error(err);
    }
}

getAuthors();
getBooks(pageNumber,limitOfBooks);

function renderAuthors (authorsArray) {
    authorsArray.forEach(author => {
        select.innerHTML += `<option value="${author.id}">${author.name}</option>`;
    });
};

function renderBooks (books) {
    cardsField.textContent = "";
    books.forEach(book => {
        cardsField.innerHTML += `   <div class="card">
                                        <div>${book.title}</div>
                                        <div>${book.price + "₽"}</div>
                                        <div>${book.author.name}</div>
                                    </div>`
    });
};

function renderPage () {
    const numberOfPages = Math.ceil(total / limitOfBooks);
    pagination.textContent = "";
    for (let i = 1; i <= numberOfPages; i++) {
        pagination.innerHTML += `<div class="page ${(pageNumber === i) ? "active" : "" }">${i}</div>`;
    };

    const allPages = document.querySelectorAll(".page");
    allPages.forEach(page => {
        page.addEventListener("click", async ()=> {
            pageNumber = Number(page.textContent);
           
            if (select.value > 0 && price.value === "1") {
                let stringOfAuthorId = `authorId=${select.value}`;
                stringOfPrice = `_sort=price&_order=asc`;
                await getBooks(pageNumber,limitOfBooks,stringOfAuthorId, "", stringOfPrice);
            } else if (select.value > 0 && price.value === "2") {
                let stringOfAuthorId = `authorId=${select.value}`;
                stringOfPrice = `_sort=price&_order=desc`;
                await getBooks(pageNumber,limitOfBooks,stringOfAuthorId, "", stringOfPrice);
            }else if (select.value > 0) {
                let stringOfAuthorId = `authorId=${select.value}`;
                await getBooks(pageNumber,limitOfBooks,stringOfAuthorId);
            }  else if (searchString.value.length > 0) {
                await getBooks(pageNumber,limitOfBooks, "", searchString.value);
            } else if (price.value === "1") {
                stringOfPrice = `_sort=price&_order=asc`;
                getBooks(pageNumber, limitOfBooks, "", "" , stringOfPrice);
            } else if (price.value === "2") {
                stringOfPrice = `_sort=price&_order=desc`;
                getBooks(pageNumber, limitOfBooks, "", "", stringOfPrice);
            }
            else {
                await getBooks(pageNumber, limitOfBooks);
            };
        });
    });
};

select.addEventListener("change", getFilteredBooks);

function getFilteredBooks () {
    pageNumber = 1;
    if (select.value === "0") {
        getBooks(pageNumber, limitOfBooks);
    } else {
        let stringOfAuthorId = `authorId=${select.value}`;
        getBooks(pageNumber,limitOfBooks,stringOfAuthorId);
    };
};

searchString.addEventListener("input", ()=> {
    pageNumber = 1;
    getBooks(pageNumber,limitOfBooks, "", searchString.value);
});

radioBtn.forEach(btn => {
    btn.addEventListener("input", async ()=> {
        limitOfBooks = Number(btn.value);
        // getBooks(pageNumber, limitOfBooks);
        if (select.value > 0) {
            let stringOfAuthorId = `authorId=${select.value}`;
            await getBooks(pageNumber,limitOfBooks,stringOfAuthorId);
        } else if (searchString.value.length > 0) {
            await getBooks(pageNumber,limitOfBooks, "", searchString.value);
        } else if (price.value === "1") {
            stringOfPrice = `_sort=price&_order=asc`;
            getBooks(pageNumber, limitOfBooks, "", "" , stringOfPrice);
        } else if (price.value === "2") {
            stringOfPrice = `_sort=price&_order=desc`;
            getBooks(pageNumber, limitOfBooks, "", "", stringOfPrice);
        }
        else {
            await getBooks(pageNumber, limitOfBooks);
        };
    });
});

price.addEventListener("change", async ()=> {
    let stringOfPrice;
    pageNumber = 1;
    if (price.value === "0" && select.value > 0) {
        let stringOfAuthorId = `authorId=${select.value}`;
        await getBooks(pageNumber,limitOfBooks,stringOfAuthorId);
    } 
    else if (price.value === "0") {
        getBooks(pageNumber, limitOfBooks);
    } else if (select.value > 0 && price.value === "1") {
        let stringOfAuthorId = `authorId=${select.value}`;
        stringOfPrice = `_sort=price&_order=asc`;
        await getBooks(pageNumber,limitOfBooks,stringOfAuthorId, "", stringOfPrice);
    } else if (select.value > 0 && price.value === "2") {
        let stringOfAuthorId = `authorId=${select.value}`;
        stringOfPrice = `_sort=price&_order=desc`;
        await getBooks(pageNumber,limitOfBooks,stringOfAuthorId, "", stringOfPrice);
    } else if (searchString.value.length > 0) {
        await getBooks(pageNumber,limitOfBooks, "", searchString.value);
    } else {
        await getBooks(pageNumber, limitOfBooks);
    };
});

