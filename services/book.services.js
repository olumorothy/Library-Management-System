const logger = require("../logs/logger");
const db = require("../models");
const ERROR_MSG = require("../utils/const");
const { getPagination, getPagingData } = require("../utils/helper");
const Book = db.books;
const operator = db.Sequelize.Op;

function createNewBook(
  title,
  isbn,
  author,
  createdBy,
  updatedBy,
  totalNumber,
  nosAvailable
) {
  return Book.create({
    title,
    isbn,
    author,
    createdBy,
    updatedBy,
    totalNumber,
    nosAvailable,
  })
    .then((book) => {
      return book;
    })
    .catch((err) => {
      logger.error(ERROR_MSG, err);
      next(err);
    });
}

function fetchAllBooks(
  page,
  size,
  title,
  author,
  isbn,
  createdBy,
  isAvailable
) {
  const { limit, offset } = getPagination(page, size);
  const conditions = [
    title ? { title: { [operator.iLike]: `%${title}%` } } : null,
    author ? { author: { [operator.iLike]: `%${author}%` } } : null,
    isbn ? { isbn: { [operator.iLike]: `%${isbn}%` } } : null,
    createdBy ? { createdBy: { [operator.iLike]: `%${createdBy}%` } } : null,
    isAvailable ? { isAvailable: isAvailable } : null,
  ];

  const filteredConditions = conditions.filter(
    (condition) => condition !== null
  );

  const query = filteredConditions.length
    ? {
        where: {
          [operator.or]: filteredConditions,
        },
        limit,
        offset,
      }
    : {
        limit,
        offset,
      };

  return Book.findAndCountAll(query)
    .then((data) => {
      const response = getPagingData(data, page, limit);
      return response;
    })
    .catch((err) => {
      logger.error(ERROR_MSG, err);
      next(err);
    });
}

module.exports = { createNewBook, fetchAllBooks };
