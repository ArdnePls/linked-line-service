'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {FILE_URL} = require('../app/config/environment');

const normalizedPath = path.join(__dirname, '.');

expect.extend({
    hasHashExpectedNonce(sentence) {
        const hashGenerated = crypto.createHash('sha256')
            .update(sentence,'utf8')
            .digest('hex')
            .toString();
        return hashGenerated.startsWith('00') ?
            {pass: true, message: () => ''} :
            {pass: false, message: () => ''}
    },
    linesAreLinked(sentences) {
        const areLinked = sentences.map((sentence, index) => {
            if(index !== 0) {
                const [hashFromCurrent] = sentence.split(',');
                const hashFromPrevious = crypto.createHash('sha256')
                    .update(sentences[index - 1],'utf8')
                    .digest('hex')
                    .toString();
                return hashFromCurrent === hashFromPrevious;
            } else {
                return true;
            }
        });
        return areLinked.every(value => value === true) ?
            {pass: true, message: () => ''} :
            {pass: false, message: () => ''}
    }
});

afterEach(done => fs.writeFile(FILE_URL, '', () => done()));

beforeAll(done => fs.writeFile(FILE_URL, '', () => done()))

afterAll(() => fs.unlinkSync(FILE_URL, () => done()))

const requireAllTestFiles = pathToSearch => {
  fs.readdirSync(pathToSearch).forEach(file => {
    if (fs.lstatSync(`${pathToSearch}/${file}`).isDirectory()) {
        requireAllTestFiles(`${pathToSearch}/${file}`);
    } else {
        require(`${pathToSearch}/${file}`);
    }
  });
};

requireAllTestFiles(normalizedPath);