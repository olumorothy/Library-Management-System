const { addBook, getAllBooks } = require("../controllers/BooksController");
const validation = require("../validators/validation");
const authorization = require("../middlewares/authorization");
const { validate } = require("../validators/validationMiddleware");
const bookRouter = require("express").Router();

bookRouter.post(
  "/addNew",

  [authorization.verifyToken, authorization.isAdmin],
  validate(validation.addBookSchema),
  addBook
);

bookRouter.get(
  "/allbooks",
  [authorization.verifyToken, authorization.isAdmin],
  getAllBooks
);

module.exports = bookRouter;
