const {
  addBook,
  getAllBooks,
  borrowBook,
  getAllBorrowedBooks,
} = require("../controllers/BooksController");
const validation = require("../validators/validation");
const authorization = require("../middlewares/authorization");
const { validate } = require("../validators/validationMiddleware");
const bookRouter = require("express").Router();

bookRouter.post(
  "/addNew",

  [authorization.tokenVerification, authorization.isAdmin],
  validate(validation.addBookSchema),
  addBook
);

bookRouter.get(
  "/allbooks",
  [authorization.tokenVerification, authorization.isAdmin],
  getAllBooks
);

bookRouter.post("/borrow/:id", authorization.tokenVerification, borrowBook);

bookRouter.get(
  "/borrowedBooks",
  authorization.tokenVerification,
  getAllBorrowedBooks
);

module.exports = bookRouter;
