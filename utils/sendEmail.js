const logger = require("../logs/logger");
const { ERROR_MSG } = require("./const");

const mailjet = require("node-mailjet").apiConnect(
  process.env.MAILJET_APIKEY_PUBLIC,
  process.env.MAILJET_APIKEY_PRIVATE
);

async function sendBorrowBookEmail(userInfo, book, borrow) {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: process.env.FROM_EMAIL,
          Name: process.env.FROM_NAME,
        },
        To: [
          {
            Email: userInfo.email,
            Name: userInfo.firstname,
          },
        ],
        Subject: "Book Order Confirmation",
        TextPart: ``,
        HTMLPart: `
              <div>Hello <b>${userInfo.firstname}</b>,</div>
              <br/><div>Your order with Id ${borrow.id} has been confirmed.You can find details of your order below</div>
              <br/>
              <div>Book Title: <b>${book.title}</b></div>
              <br/>
              <div>Author: <b>${book.author}</b></div>
              <br/>
              <div>ISBN: <b>${book.isbn}</b></div>
              <br/>
              <div>Due Date: <b>${borrow.dueDate}</b></div>
              <br/>
              <div>Order Id: <b>${borrow.id}</b></div>
            `,
      },
    ],
  });

  try {
    const result = await request;
    console.log(result.body);
  } catch (err) {
    logger.error(ERROR_MSG, err);
    throw new Error({ error: err.statusCode });
  }
}

module.exports = { sendBorrowBookEmail };
