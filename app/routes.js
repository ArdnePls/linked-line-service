const fileHandler = require('./controllers/fileHandler');

exports.init = app => {

  app.get("/health_check", (req, res) => res.status(200).send("Hello World!"));

  app.get("/", [], fileHandler.readFile);

  app.post("/", [], fileHandler.writeNewLine);

  app.put("/", [], fileHandler.replaceLine);

}