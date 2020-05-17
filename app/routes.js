const fileHandler = require('./controllers/fileHandler');
const { bodyIsComplete, indexIsCorrect } = require('./middlewares/updateFileValidations');
const { validate } = require('./middlewares/validations');

exports.init = app => {

  app.get("/health_check", (req, res) => res.status(200).send("Hello World!"));

  app.get("/", [], fileHandler.readFile);

  app.post("/", [], fileHandler.writeNewLine);

  app.put("/", [bodyIsComplete, validate.validations, indexIsCorrect], fileHandler.replaceLine);

}