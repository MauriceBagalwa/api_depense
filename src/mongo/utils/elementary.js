const sendmail = require("sendmail");
const nodemailer = require("nodemailer");
const Entreprise = require("../schemas/entreprise-Schema");
const User = require("../schemas/user-schema");
const createError = require("http-errors");
const client_ = require("@sendgrid/mail");
client_.setApiKey(
  "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"
);
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
      if (err)
        res.send({
          code: 400,
          message: "mail",
        });
      else
        res.send({
          code: 200,
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
  SendGridMail: async (req, res, next) => {
    const { entreprise, mail, code } = req;
    client_
      .send({
        to: {
          email: mail,
          name: "dev",
        },
        from: {
          email: "mauricebagalwa009@gmail.com",
          name: "Updepense",
        },
        templateId: "d-5bc63f75028d4c20a8e19d5bba769efe",
        dynamicTemplateData: {
          code: code,
        },
      })
      .then((send) => {
        if (send) {
          res.send({
            entreprise: entreprise,
            mail: mail,
            code: code,
          });
        } else {
          res.status(400).json({
            status: 400,
            message: "Mail non envoyer.",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  },
  SendGridUserMail: async (req, res, next) => {
    const { email, username } = req;
    client_
      .send({
        to: {
          email: email,
          name: "dev",
        },
        from: {
          email: "mauricebagalwa009@gmail.com",
          name: "Updepense",
        },
        templateId: "d-779328f513294e019cd8b8cfcb0ca15a",
        dynamicTemplateData: {
          username,
        },
      })
      .then((send) => {
        if (send) {
          next();
        } else {
          res.status(400).json({
            status: 400,
            message: "Mail non envoyer.",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  },
};
