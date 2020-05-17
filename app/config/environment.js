require('dotenv').config();
const path = require('path').join(__dirname, '.');

const {
    PORT,
    FILE_URL,
    NODE_ENV,
} = process.env;

module.exports = {
    PORT,
    FILE_URL: NODE_ENV === 'test' ? `${path}/../../test/sample.txt` : FILE_URL,
};
