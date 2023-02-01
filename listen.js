const { PORT = 9090 } = process.env;
const app = require("./server.js");
const logger = require("./logs/logger");
const Liquibase = require("liquibase").Liquibase;

const POSTGRESQL_DEFAULT_CONFIG =
  require("liquibase").POSTGRESQL_DEFAULT_CONFIG;

const myConfig = {
  ...POSTGRESQL_DEFAULT_CONFIG,
  changeLogFile: "./resources/liquibase/db.changelog.xml",
  url: "jdbc:postgresql://localhost:5432/lms",
  username: "admin",
  password: "",
};
const instTs = new Liquibase(myConfig);

instTs.status();

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
