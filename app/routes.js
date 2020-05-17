const fileHandler = require('./controllers/fileHandler');
const { bodyUpdateIsComplete, indexIsCorrect } = require('./middlewares/updateFileValidations');
const { bodyPostIsComplete } = require('./middlewares/createLineValidations');
const { validate } = require('./middlewares/validations');

exports.init = app => {

  app.get("/health_check", (req, res) => res.status(200).send("Hello World!"));

  app.get("/", [], fileHandler.readFile);

  app.post("/", [bodyPostIsComplete, validate.validations], fileHandler.writeNewLine);

  app.put("/", [bodyUpdateIsComplete, validate.validations, indexIsCorrect], fileHandler.replaceLine);

}