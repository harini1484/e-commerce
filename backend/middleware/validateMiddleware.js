const Joi = require("joi");

// Middleware to validate request body
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.json({ message: error.details[0].message });
    }
    next();
  };
};

// Middleware to validate route parameters
const validateParams = (schema, paramName) => {
  return (req, res, next) => {
    const { error } = schema.validate({ [paramName]: req.params[paramName] });
    if (error) {
      return res.json({ message: error.details[0].message });
    }
    next();
  };
};

module.exports = { validateBody, validateParams };
