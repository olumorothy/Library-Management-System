const logger = require("../logs/logger");
const db = require("../models");
const ERROR_MSG = require("../utils/const");
const Book = db.books;

function createNewBook(title, isbn, author) {
  return Book.create({
    title,
    isbn,
    author,
  })
    .then((book) => {
      return book;
    })
    .catch((err) => {
      logger.error(ERROR_MSG, err);
      next(err);
    });
}

function fetchAllBooks() {
  return Book.findAll()
    .then((books) => {
      return books;
    })
    .catch((err) => {
      logger.error(ERROR_MSG, err);
      next(err);
    });
}

module.exports = { createNewBook, fetchAllBooks };
