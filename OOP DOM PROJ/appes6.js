class Book {
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}

class UI {
	addBook(book) {
		const list = document.getElementById("book-list");
		const row = document.createElement("tr");
		row.innerHTML = `
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td><a href='#' class = 'delete'>X</a></td>
  `;
		list.appendChild(row);
	}

	clearFields() {
		document.getElementById("title").value = "";
		document.getElementById("author").value = "";
		document.getElementById("isbn").value = "";
	}
	showAlert(message, className) {
		const div = document.createElement("div");
		div.className = `alert ${className}`;
		div.appendChild(document.createTextNode(message));

		const container = document.querySelector(".container");
		const form = document.getElementById("book-form");
		container.insertBefore(div, form);

		setTimeout(function () {
			document.querySelector(".alert").remove();
		}, 1500);
	}
	deleteBook(target) {
		if (target.className === "delete") {
			target.parentElement.parentElement.remove();
		}
	}
}

class Store {
	static getBooks() {
		let books;
		if (localStorage.getItem("books") === null) {
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem("books"));
		}
		return books;
	}
	static displayBooks() {
		const books = Store.getBooks();
		books.forEach(function (book) {
			const ui = new UI();
			ui.addBook(book);
		});
	}
	static addBook(book) {
		let books = Store.getBooks();
		books.push(book);
		localStorage.setItem("books", JSON.stringify(books));
	}
	static removeBook(target) {
		const isbn = target.parentElement.previousElementSibling.textContent;
		let books = Store.getBooks();
		books.forEach(function (book, index) {
			if (book.isbn === isbn) {
				books.splice(index, 1);
			}
		});
		localStorage.setItem("books", JSON.stringify(books));
	}
}

document.addEventListener("DOMContentLoaded", Store.displayBooks);

document.getElementById("book-form").addEventListener("submit", function (e) {
	const title = document.getElementById("title").value;
	const author = document.getElementById("author").value;
	const isbn = document.getElementById("isbn").value;

	const book1 = new Book(title, author, isbn);

	const ui = new UI();

	if (title === "" || author === "" || isbn === "") {
		ui.showAlert("invalid input", "error");
	} else {
		ui.addBook(book1);

		ui.showAlert("YOUR BOOK IS ADDED SUCCESSFULLY", "success");

		Store.addBook(book1);

		ui.clearFields();
	}

	e.preventDefault();
});

document.getElementById("book-list").addEventListener("click", function (e) {
	const ui = new UI();
	ui.deleteBook(e.target);
	Store.removeBook(e.target);
	ui.showAlert("BOOK DELETED SUCCESSFULLY", "success");
});
