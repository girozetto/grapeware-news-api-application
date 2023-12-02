const convertDate = (dataString = "") => {
  const meses = {
    Janeiro: "01",
    Fevereiro: "02",
    Março: "03",
    Abril: "04",
    Maio: "05",
    Junho: "06",
    Julho: "07",
    Agosto: "08",
    Setembro: "09",
    Outubro: "10",
    Novembro: "11",
    Dezembro: "12",
  };

  //Formato que se espera: 13 Novembro de 2023  | 09h11

  // Dividir a string de data e hora
  const partes = dataString.split("|");
  const dataParte = partes[0]
    .trim()
    .replace(/\sde\s|\s+/g, " ")
    .split(" ");
  const horaParte = partes[1].trim();
  const horaParteFormatada = horaParte.replace("h", ":");

  const dia = dataParte[0];

  const mes = meses[dataParte[1]];
  if (!mes) {
    console.error("Mês inválido na data:", dataString);
    return null;
  }

  const ano = dataParte[2];
  const dataFormatada = `${ano}-${mes}-${dia}T${horaParteFormatada}:00`;

  const dataObj = new Date(dataFormatada);
  if (isNaN(dataObj.getTime())) {
    throw new Error("Data inválida");
  }

  return dataObj;
};

module.exports = { convertDate };
