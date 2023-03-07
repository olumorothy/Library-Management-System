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
  isAvailable,
  dateFrom,
  dateTo
) {
  const { limit, offset } = getPagination(page, size);

  const conditions = [
    title ? { title: { [operator.iLike]: `%${title}%` } } : null,
    author ? { author: { [operator.iLike]: `%${author}%` } } : null,
    isbn ? { isbn: { [operator.iLike]: `%${isbn}%` } } : null,
    createdBy ? { createdBy: { [operator.iLike]: `%${createdBy}%` } } : null,
    isAvailable ? { isAvailable: isAvailable } : null,
    dateFrom ? { createdAt: { [operator.gte]: dateFrom } } : null,
    dateTo ? { createdAt: { [operator.lte]: dateTo } } : null,
  ];

  const filteredConditions = conditions.filter(
    (condition) => condition !== null
  );

  let query = filteredConditions.length
    ? {
        where: {
          [operator.and]: filteredConditions,
        },
        limit,
        offset,
      }
    : {
        limit,
        offset,
      };

  if (dateFrom && dateTo) {
    query.where.createdAt = {
      [operator.between]: [dateFrom, dateTo],
    };
  }

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
