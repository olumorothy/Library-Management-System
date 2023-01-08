exports.validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    res.status(400).send(error.details[0].message);
  } else {
    next();
  }
};
