//Dependências
const { render } = require("ejs");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
//const cors = require("cors");//obter cors

//Configurações
const aplicativo = express();
const PORTA = process.env.PORT || 3000;

//Definindo a engine  que será usada para renderização
aplicativo.set("views", path.join(__dirname, "views"));
aplicativo.set("view engine", "ejs");

//Habilitar cors
//aplicativo.use(cors())

//Definindo o tipo de middleware
aplicativo.use(bodyParser.json({ limit: "10mb" }));
aplicativo.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
aplicativo.use(express.json());
aplicativo.use(express.urlencoded({ extended: true }));
aplicativo.use(express.static("public"));

//Definindo as rotas para cada entidade
require("./operations/routes/newsRoutes")(aplicativo);
require("./operations/routes/viewRoutes")(aplicativo);

//Inicializando o servidor
aplicativo.listen(PORTA, () => {
  console.log(`Servidor começou o arranque na PORTA: ${PORTA}`);
});
