const express = require("express");
const mainRouter = require("./router/mainrouter");

const app = express();

app.use(express.json());
app.use('/json', mainRouter);

module.exports = app;