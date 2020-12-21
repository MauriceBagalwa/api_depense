const express = require("express");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const CreatError = require("http-errors");
const router = require("./src/routers");
require("./src/mongo/utils/db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyparser.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Welcome to Depense_App...");
});

/*
? @End point
*/
app.use("/dep/v1/user", router.userRouter);
app.use("/dep/v1/entreprise", router.entrepriseRouter);
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
