const { PORT = 9090 } = process.env;
const app = require("./server.js");
const logger = require("./logs/logger");

app.listen(PORT, (err) => {
  if (err) logger.error("An error has occured: ", err);

  logger.info(`Listening on ${PORT}...`);
});

// const liquibase = require('liquibase');

// liquibase({
//   changeLogFile: 'resources/liquibase/db.changelog.xml',
//   url: 'jdbc:postgresql://localhost:5432/postgres',
//   username: 'postgres',
//   password: 'admin'
// })
// .run('<action>', '<action-params>')
// .then(() => console.log('success'))
// .catch((err) => console.log('fail', err));
