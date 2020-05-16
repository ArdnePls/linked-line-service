const fs = require('fs');
const util = require('util');
const crypto = require('crypto');
const { FILE_URL } = require('../config/environment');

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
    }
    return nonce;
};

const createHashForFirstLine = () => {
    const newHash = crypto.createHash('sha256').digest('hex').toString();
    return newHash.replace(newHash.substring(0, 2), '00');
};

exports.obtainLastLine = async () => {
    const readFile = util.promisify(fs.readFile);
    const sentences = await readFile(FILE_URL)
        .then(data => data.toString().split('\n'));
    sentences.pop();
    console.log(sentences);
    return sentences[sentences.length - 1];
};

exports.getSentenceFromLastLine = (lastline, sentenceFromRequest) => {
    const prevHash = !lastline ? 
        createHashForFirstLine() :
        crypto.createHash('sha256').update(lastline).digest('hex');
    const nonce = calculateNonce(`${prevHash},${sentenceFromRequest},`);
    return Promise.resolve(`${prevHash},${sentenceFromRequest},${nonce}\n`);
};