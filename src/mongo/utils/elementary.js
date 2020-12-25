const sendmail = require("sendmail");
const nodemailer = require("nodemailer");
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
};
