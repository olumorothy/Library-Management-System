const logger = require("../logs/logger");
const db = require("../models");
const ERROR_MSG = require("../utils/const");
const { getPagination, getPagingData } = require("../utils/helper");
const Book = db.books;
const User = db.users;
const Borrowing = db.borrowings;
const operator = db.Sequelize.Op;
const { sequelize } = require("../models");

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

async function createBorrowing(book_id, user_id, updatedBy, nosAvailable) {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const borrow = await Borrowing.create(
      { bookId: book_id, userId: user_id, updatedBy },
      { transaction }
    );

    await Book.update(
      { nosAvailable: nosAvailable - 1 },
      { where: { id: book_id } },
      { transaction }
    );

    await transaction.commit();
    return borrow;
  } catch (err) {
    logger.error(ERROR_MSG, err);
    if (transaction) {
      await transaction.rollback();
    }
  }
}

function fetchBookById(book_id) {
  return Book.findOne({ where: { id: book_id } }).then((book) => {
    if (book) {
      return book;
    } else {
      return Promise.reject({ status: 404, msg: "Book not found" });
    }
  });
}

function fetchAllBorrowedBooks(user_id, role, page, size) {
  const { limit, offset } = getPagination(page, size);
  let condition = { userId: user_id };
  if (role === "admin") {
    condition = {};
  }
  return Borrowing.findAndCountAll({
    include: [
      {
        model: Book,
        attributes: ["title", "isbn"],
        as: "book",
      },
      {
        model: User,
        attributes: ["email", "firstname", "lastname"],
        as: "user",
      },
    ],
    where: condition,
    limit,
    offset,
  }).then((data) => {
    const response = getPagingData(data, page, limit);
    return response;
  });
}

module.exports = {
  createNewBook,
  fetchAllBooks,
  fetchBookById,
  createBorrowing,
  fetchAllBorrowedBooks,
};
