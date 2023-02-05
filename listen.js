const { PORT = 9090 } = process.env;
const app = require("./server.js");
const logger = require("./logs/logger");

app.listen(PORT, (err) => {
  if (err) logger.error("An error has occured: ", err);

  logger.info(`Listening on ${PORT}...`);
});
