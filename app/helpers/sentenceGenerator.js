const fs = require('fs');
const util = require('util');
const crypto = require('crypto');
const { FILE_URL } = require('../config/environment');
const logger = require('../logger');

const calculateNonce = (hashLine) => {
    let nonceSucceeded = false;
    let nonce = 1;
    while (!nonceSucceeded) {
        const hashGenerated = crypto.createHash('sha256')
            .update(`${hashLine}${nonce}`,'utf8')
            .digest('hex')
            .toString();
        if (hashGenerated.startsWith('00')) {
            nonceSucceeded = true;
        } else {
            nonce ++;
        }
    };
    logger.info(`Obtained nonce: ${nonce}`);
    return nonce;
};

const createHashForFirstLine = () => {
    const newHash = crypto.createHash('sha256').digest('hex').toString();
    return newHash.replace(newHash.substring(0, 2), '00');
};

const obtainAllLines = async () => {
    const readFile = util.promisify(fs.readFile);
    const sentences = await readFile(FILE_URL)
        .then(data => data.toString().split('\n'));
    sentences.pop();
    return sentences;
}

const obtainLastLine = async () => {
    const sentences = await obtainAllLines();
    return sentences[sentences.length - 1];
};

const getSentenceFromLastLine = (lastline, sentenceFromRequest) => {
    const prevHash = !lastline ? 
        createHashForFirstLine() :
        crypto.createHash('sha256').update(lastline).digest('hex');
    const nonce = calculateNonce(`${prevHash},${sentenceFromRequest},`);
    return (`${prevHash},${sentenceFromRequest},${nonce}`);
};

const regenerateDataWhenAlterFile = (sentencesToPersist, sentencesToModificate) => {
    sentencesToModificate.forEach(sentence => {
        const sentenceToPersist = sentence.split(',')[1];
        sentencesToPersist.push(getSentenceFromLastLine(sentencesToPersist[sentencesToPersist.length - 1], sentenceToPersist));
    });
    logger.info(`Modificated file: ${sentencesToPersist.join('\n')}\n`);
    return (`${sentencesToPersist.join('\n')}\n`);
};

const getNewGeneratedData = async (newSentence, index) => {
    const sentences = await obtainAllLines();
    logger.info(`Sentences on file: ${util.inspect(sentences, false, null)}`);
    const positionToUpdate = index - 1;
    const sentencesToPersist = sentences.slice(0, positionToUpdate);
    logger.info(`Sentences to not modificate: ${sentencesToPersist}`);
    logger.info(`Sentence to update: ${sentences[positionToUpdate]} with message: ${newSentence}`);
    sentencesToPersist.push(getSentenceFromLastLine(sentences[positionToUpdate - 1], newSentence));
    logger.info(`Sentences to persist updated: ${sentencesToPersist}`);
    const sentencesToModificate = sentences.slice(index, sentences.length);
    logger.info(`Sentences to update hashes and persist messages: ${sentencesToModificate}`);
    return regenerateDataWhenAlterFile(sentencesToPersist, sentencesToModificate);
};

module.exports = { obtainLastLine, getSentenceFromLastLine, getNewGeneratedData, obtainAllLines };