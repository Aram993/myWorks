const authorsURL = "http://localhost:3000/authors";
const booksURL = "http://localhost:3000/books";

const container = document.querySelector(".container");


async function getData (URL) {
    try {
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error(error);
    };
}

getData(authorsURL);
const authorsArray = getData(authorsURL);
console.log(authorsArray);