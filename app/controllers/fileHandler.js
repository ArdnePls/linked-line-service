const fs = require('fs');
const {FILE_URL} = require('../config/environment');

exports.readFile = (req, res, next) => res.send(fs.readFileSync(FILE_URL, 'utf8'));

exports.writeNewLine = (req, res, next) => {
    console.log(req.body);
    fs.appendFileSync(FILE_URL, `${req.body.sentence}\n`)
    return res.status(201).send();
}