const logger = require("../logs/logger");
const db = require("../models");
const ERROR_MSG = require("../utils/const");
const { getPagination, getPagingData, getDueDate } = require("../utils/helper");
const Book = db.books;
const User = db.users;
const Borrowing = db.borrowings;
const operator = db.Sequelize.Op;
const { sequelize } = require("../models");
const { sendBorrowBookEmail } = require("../utils/sendEmail");
const producer = require("./messaging/producer");

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

async function createBorrowing(book, user_id, lastUpdatedBy, nosAvailable) {
  const dueDate = getDueDate();
  const userInfo = await User.findByPk(user_id, {
    attributes: ["firstname", "email"],
  });

  let borrow;

  try {
    await sequelize.transaction(async function (transaction) {
      borrow = await Borrowing.create(
        { bookId: book.id, userId: user_id, lastUpdatedBy, dueDate },
        { transaction }
      );

      await Book.update(
        { nosAvailable: nosAvailable - 1 },
        { where: { id: book.id } },
        { transaction }
      );
    });

    const allMessages = {
      userData: userInfo,
      bookData: book,
      borrowedBook: borrow,
    };

    await producer.connect();
    await producer.produce(allMessages);

    return borrow;
  } catch (err) {
    logger.error(ERROR_MSG, err);
    return Promise.reject({ status: 500, msg: "Internal Server Error" });
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
