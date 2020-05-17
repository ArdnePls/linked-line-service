const { validationResult } = require('express-validator');
const logger = require('../logger');

exports.validate = {
  validations: (req, res, next) => {
    try {
      const result = validationResult(req);
      logger.info(`Errors is empty: ${result.isEmpty()}`);
      if (result.isEmpty()) {
        next();
      } else {
        result.throw();
      }
      res.status(200);
    } catch (err) {
      const map = err.array();
      res.status(400).send({ message: map[0].msg });
    }
  }
};