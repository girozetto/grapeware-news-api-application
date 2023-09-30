module.exports = (aplicativo) => {
  const viewsController = require("../controllers/viewsController");

  var roteador = require("express").Router();

  roteador.get("/creator", viewsController.viewCreator);

  aplicativo.use("/views", roteador);
};
