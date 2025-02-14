const authorsURL = "http://localhost:3000/authors";
const booksURL = "http://localhost:3000/books";

const container = document.querySelector(".container");

const authorsArray = [];
async function getData (URL, array) {
    try {
        const response = await axios.get(URL);
        array.push(...response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    };
}

getData(authorsURL, authorsArray);

function renderAuthors (element, array) {
    array.forEach(item => {
        
    })
}
