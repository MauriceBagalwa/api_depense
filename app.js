const express = require("express");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const CreatError = require("http-errors");
const router = require("./src/routers");
const nodemailer = require("nodemailer");
const nodemailerMailgum = require("nodemailer-mailgun-transport");

require("./src/mongo/utils/db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyparser.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Welcome to Depense_App... ");
});

/*
? @End point
*/
app.use("/dep/v1/user", router.userRouter);
app.use("/dep/v1/entreprise", router.entrepriseRouter);
app.use("/dep/v1/function", router.functionRouter);
app.use("/dep/v1/operation", router.operation);
// app.use("/middleware", router.middleware);
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

/*
? Sendted mail
*/

// /* --------------------------------- Etape 1 -------------------------------- */

// const auth = {
//   auth: {
//     api_key: "",
//     domaine: "",
//   },
// };
// /* --------------------------------- Etape 2 -------------------------------- */
// let transporter = nodemailer.createTransport(nodemailerMailgum(auth));

// const mailOptions = {
//   from: '"Test mail" <mauricebagalwa009@gmail.com>',
//   to: "dev.maurice1317@gmail.com",
//   subject: "Code de confirmation",
//   text: "votre code de confitmation est 237899",
// };

// transporter.sendMail(mailOptions, function (err, data) {
//   if (err) {
//     res.send({
//       status: 400,
//       message: "Adress mail incorrect",
//     });
//   } else {
//   }
// });
/*
? Sendted mail
*/
app.listen(PORT, () => {
  console.log(`server in runing at 🚀 http://localhost:${PORT}`);
});
