module.exports = (aplicativo) => {
  const newsController = require("../controllers/newsController");

  var roteador = require("express").Router();

  roteador.get("/latest", newsController.getLatestNews);
  roteador.get("/:id", newsController.getNewsById);
  roteador.get("/page/:pageNumber", newsController.getNewsByPage);
  roteador.post("/", newsController.create);

  aplicativo.use("/api/news", roteador);
};
