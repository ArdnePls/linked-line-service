const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./app/routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

routes.init(app);

module.exports = app;
