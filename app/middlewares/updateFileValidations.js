const { check } = require('express-validator');
const { obtainAllLines } = require('../helpers/sentenceGenerator');

exports.bodyUpdateIsComplete = [
  check('index')
    .exists()
    .withMessage('Index field is empty.'),

  check('sentence')
    .exists()
    .withMessage('Sentence field is empty.')
];

exports.indexIsCorrect = async (req, res, next) => {
    const index = parseInt(req.body.index);
    const lines = await obtainAllLines();
    const linesQuantity = lines.length;
    if (linesQuantity === 0) {
        res.status(400).send('There are no lines to update.');
    } else if ((index > 0) && (index <= linesQuantity)) {
      next();
    } else {
      res.status(400).send(`Index value should be between 1 and ${linesQuantity}.`);
    }
  };