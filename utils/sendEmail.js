const logger = require("../logs/logger");
const { cloudinary } = require("../resources/cloudinary/cloudinary");
const { ERROR_MSG, headerImg, footerImg, footer2 } = require("./const");

const pug = require("pug");
const mailjet = require("node-mailjet").apiConnect(
  process.env.MAILJET_APIKEY_PUBLIC,
  process.env.MAILJET_APIKEY_PRIVATE
);

async function sendBorrowBookEmail(userInfo, book, borrow) {
  const borrowBookEmailTemplate = pug.compileFile("views/borrowBookEmail.pug");

  const mail = borrowBookEmailTemplate({
    userInfo: userInfo,
    book: book,
    borrow: borrow,
    headerImg: cloudinary.url("Order_confirmation_pvxoua"),
    footerImg: cloudinary.url("footer_ptpzrv"),
  });

  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: process.env.FROM_EMAIL,
          Name: process.env.FROM_NAME,
        },
        To: [
          {
            Email: "iseoluwa89@gmail.com",
            Name: userInfo.firstname,
          },
        ],
        Subject: "Book Order Confirmation",
        TextPart: ``,
        HTMLPart: mail,
      },
    ],
  });

  try {
    await request;
  } catch (err) {
    logger.error(ERROR_MSG, err);
    throw new Error({ error: err.statusCode });
  }
}

module.exports = { sendBorrowBookEmail };
