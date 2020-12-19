const express = require("express");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const CreatError = require("http-errors");
require("./src/mongo/utils/db");
const app = express();
const PORT = 3000;

app.use(bodyparser.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Welcome to Depense_App...");
});
/*
? Gestionnaire des Erreurs
*/
app.use(async (req, res, next) => {
  next(CreatError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
app.listen(PORT, () => {
  console.log(`server in runing at 🚀 http://localhost:${PORT}`);
});
