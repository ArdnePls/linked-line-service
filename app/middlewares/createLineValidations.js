const { check } = require('express-validator');

exports.bodyPostIsComplete = [
    check('sentence')
      .exists()
      .withMessage('Sentence field is empty.')
  ];