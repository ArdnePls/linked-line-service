const fs = require('fs');
const { FILE_URL } = require('../config/environment');
const { getSentenceFromLastLine, obtainLastLine, getNewGeneratedData } = require('../helpers/sentenceGenerator');
const logger = require('../logger');

exports.readFile = (req, res, next) => res.send(fs.readFileSync(FILE_URL, 'utf8'));

exports.replaceLine = async (req, res, next) => {
    const { sentence, index } = req.body;
    const dataToWrite = await getNewGeneratedData(sentence, index);
    fs.writeFileSync(FILE_URL, dataToWrite);
    return res.status(200).send(fs.readFileSync(FILE_URL, 'utf8'));
}

exports.writeNewLine = async (req, res, next) => {
    const { sentence } = req.body;
    const lastLine = await obtainLastLine();
    const sentenceToWrite = `${getSentenceFromLastLine(lastLine, sentence)}\n`;
    logger.info(sentenceToWrite);
    fs.appendFileSync(FILE_URL, sentenceToWrite);
    return res.status(201).send(fs.readFileSync(FILE_URL, 'utf8'));
}