const authorsURL = "http://localhost:3000/authors";
const booksURL = "http://localhost:3000/books";

const select = document.querySelector("#authors");
const container = document.querySelector(".container");

const authorsArray = [];
async function getData (URL) {
    try {
        const response = await axios.get(URL);
        authorsArray.push(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    };
}

getData(authorsURL);

const renderAuthors = (element, array) => {
    array.forEach(item => {
       element.innerHTML += `<option value="${item.id}">${item.name}</option>`
    });
};

console.log(authorsArray.length);

select.innerHTML += `<option value="Max">Max</option>`