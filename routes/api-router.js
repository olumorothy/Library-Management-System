const apiRouter = require("express").Router();

const usersRouter = require("./usersRouter");
const booksRouter = require("./booksRouter");

apiRouter.use("/users", usersRouter);
apiRouter.use("/books", booksRouter);

module.exports = apiRouter;
