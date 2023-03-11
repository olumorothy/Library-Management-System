const logger = require("../logs/logger");

const {
  fetchAllBooks,
  createNewBook,
  fetchBookById,
  createBorrowing,
  fetchAllBorrowedBooks,
} = require("../services/book.services");
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

function borrowBook(req, res, next) {
  const book_id = req.params.id;

  const user_id = req.id;
  const updatedBy = req.id;

  fetchBookById(book_id)
    .then((book) => {
      if (book.isAvailable) {
        createBorrowing(book_id, user_id, updatedBy, book.nosAvailable)
          .then((borrow) => {
            res.status(201).send({ borrow });
          })
          .catch((err) => {
            next(err);
          });
      } else {
        return res.status(204).send({ message: "Book is not available" });
      }
    })
    .catch((err) => {
      next(err);
    });
}

function getAllBorrowedBooks(req, res, next) {
  const { page, size } = req.query;
  const user_id = req.id;
  const role = req.role;

  fetchAllBorrowedBooks(user_id, role, page, size)
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { addBook, getAllBooks, borrowBook, getAllBorrowedBooks };
