const fs = require('fs');
const { FILE_URL } = require('../config/environment');
const { getSentenceFromLastLine, obtainLastLine } = require('../helpers/sentenceGenerator');

exports.readFile = (req, res, next) => res.send(fs.readFileSync(FILE_URL, 'utf8'));

// add logic by req index and sentence
exports.replaceLine = (req, res, next) => res.status(200).send();

exports.writeNewLine = async (req, res, next) => {
    const { sentence } = req.body;
    const lastLine = await obtainLastLine();
    getSentenceFromLastLine(lastLine, sentence)
        .then(sentenceToWrite => fs.appendFileSync(FILE_URL, sentenceToWrite));
    return res.status(201).send();
}