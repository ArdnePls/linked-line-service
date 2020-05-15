exports.init = app => {

  app.get("/", (req, res) => res.status(200).send("Hello World!"));

  app.post("/", (req, res) => res.status(200).send("Hello World!"));

}