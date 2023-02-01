const logger = require("../logs/logger");
const db = require("../models");
const { fetchAllBooks, createNewBook } = require("../services/book.services");
const { ERROR_MSG } = require("../utils/const");

function addBook(req, res, next) {
  const { title, isbn, author } = req.body;
  createNewBook(title, isbn, author)
    .then((book) => {
      res.status(201).send({ book });
    })
    .catch((err) => {
      logger.error(ERROR_MSG, err);
      next(err);
    });
}

function getAllBooks(req, res, next) {
  fetchAllBooks()
    .then((books) => {
      res.status(200).send({ books });
    })
    .catch((err) => {
      logger.error(ERROR_MSG, err);
      next(err);
    });
}

module.exports = { addBook, getAllBooks };
