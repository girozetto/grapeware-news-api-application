module.exports = (aplicativo) => {
  const newsController = require("../controllers/newsController");

  var roteador = require("express").Router();

  roteador.post("/", newsController.create);

  aplicativo.use("/api/news", roteador);
};
