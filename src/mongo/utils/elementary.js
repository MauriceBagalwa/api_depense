const sendmail = require("sendmail");
const nodemailer = require("nodemailer");
const Entreprise = require("../schemas/entreprise-Schema");
const createError = require("http-errors");
require("dotenv").config();

module.exports = {
  sendEmail: async (req, res, next) => {
    var tranporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_FROM || "mauricebagalwa009@gmail.com",
        pass: process.env.PSSWD_MAIL || "remaurice1kin",
      },
    });

    var mailOptions = {
      from: `mauricebagalwa009@gmail.com`,
      to: req.to,
      subject: req.subject,
      text: req.message,
    };

    tranporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else
        res.send({
          message: `Mail send to ${info.response}`,
        });
    });
  },
  verifyMailEntreprise: async (req, res, next) => {
    try {
      console.log(req.query);
      const find = Entreprise.findOne({ mail: req.query.mail });
      if (find) createError.Conflict(`Incorrect mail`);
      else
        res.send({
          message: "Autentique",
        });
    } catch (error) {
      console.log(error);
    }
  },
};
