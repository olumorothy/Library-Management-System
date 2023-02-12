const logger = require("../logs/logger");

const { fetchAllBooks, createNewBook } = require("../services/book.services");
const { ERROR_MSG } = require("../utils/const");

function addBook(req, res, next) {
  const { title, isbn, author, totalNumber, nosAvailable } = req.body;
  const createdBy = req.id;
  const updatedBy = req.id;
  createNewBook(
    title,
    isbn,
    author,
    createdBy,
    updatedBy,
    totalNumber,
    nosAvailable
  )
    .then((book) => {
      res.status(201).send({ book });
    })
    .catch((err) => {
      logger.error(ERROR_MSG, err);
      next(err);
    });
}

function getAllBooks(req, res, next) {
  const {
    page,
    size,
    title,
    author,
    isbn,
    createdBy,
    isAvailable,
    dateFrom,
    dateTo,
  } = req.query;
  fetchAllBooks(
    page,
    size,
    title,
    author,
    isbn,
    createdBy,
    isAvailable,
    dateFrom,
    dateTo
  )
    .then((books) => {
      res.status(200).send({ books });
    })
    .catch((err) => {
      logger.error(ERROR_MSG, err);
      next(err);
    });
}

module.exports = { addBook, getAllBooks };
