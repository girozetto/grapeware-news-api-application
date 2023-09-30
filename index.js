//Dependências
const { render } = require("ejs");
const express = require("express");
const path = require("path");

//Configurações
const aplicativo = express();
const PORTA = process.env.PORT || 3000;

//Definindo a engine  que será usada para renderização
aplicativo.set("views", path.join(__dirname,"views"));
aplicativo.set("view engine", "ejs");

//Definindo o tipo de middleware
aplicativo.use(express.json());
aplicativo.use(express.urlencoded({ extended: true }));
aplicativo.use(express.static("public"));

//Definindo as rotas para cada entidade
require('./operations/routes/newsRoutes')(aplicativo);
require('./operations/routes/viewRoutes')(aplicativo);


//Inicializando o servidor
aplicativo.listen(PORTA, () => {
  console.log(`Servidor começou o arranque na PORTA: ${PORTA}`);
});
