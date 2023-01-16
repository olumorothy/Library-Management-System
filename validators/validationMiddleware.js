const logger = require("../logs/logger");
exports.validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    logger.error("An error has occured: ", error);
    res.status(400).send(error.details[0].message);
  } else {
    next();
  }
};
