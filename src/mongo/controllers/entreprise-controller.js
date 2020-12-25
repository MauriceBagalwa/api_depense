const Entreprise = require("../schemas/entreprise-Schema");
const UserSchema = require("../schemas/user-schema");
const createError = require("http-errors");
const { sendEmail } = require("../utils/elementary");

var randomFixedInteger = function (length) {
  return Math.floor(
    Math.pow(10, length - 1) +
      Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
  );
};

module.exports = {
  /* --------------------------- get all entreprise --------------------------- */
  /*@1 */
  entreprises: (req, res, next) => {
    Entreprise.find()
      .then((find) => {
        res.status(200).json({ find });
      })
      .catch((error) => {
        next(error);
      });
  },
  /*@2 */
  entreprisesOperation: (req, res, next) => {
    Entreprise.find({ etat: true })
      .then((find) => {
        res.status(200).json({ find });
      })
      .catch((error) => {
        next(error);
      });
  },
  /* ------------------------ update data of entreprise ----------------------- */
  updateEntreprise: (req, res, next) => {
    const values = req.body;
    console.log(values);
    Entreprise.findById(values._id).then((find) => {
      if (!find)
        res.status(400).json({
          message: "Entreprise no Found.",
        });
      else {
        find
          .update(values)
          .then((updated) => {
            res.status(200).json({
              message: "Data update.",
              updated,
            });
          })
          .catch((error) => {
            next(error);
          });
      }
    });
  },

  changeEtat: async (entreprise, res, next) => {
    const find = await Entreprise.findById((_id = entreprise));
    if (!find)
      res.status(200).json({
        message: "Entreprise not created",
      });
    else {
      await find
        .updateOne({ created: true, code: randomFixedInteger(6) })
        .then(function () {
          res.status(200).json({
            find,
          });
        })
        .catch((error) => {
          next(error);
        });
    }
  },
  /* --------------------------- add new entreprise --------------------------- */

  entreprise: async (req, res, next) => {
    const { name, rccm, mail, number, adresse, user } = req.body;

    const find = await Entreprise.findOne({
      $and: [{ created: true }, { $or: [{ name }, { mail }] }],
    }).catch((error) => {});

    if (find)
      res.status(400).json({
        message: "Entreprise or email address already exist.",
      });
    else {
      const entreprise = new Entreprise({
        name: name,
        rccm: rccm,
        mail: mail,
        number: number,
        adresse: adresse,
      });

      await entreprise
        .save()
        .then((created) => {
          user.entreprise = created._id;
          UserSchema.findOne({
            $and: [{ entreprise: user.entreprise }, { email: user.email }],
          }).then((find) => {
            if (find)
              res.status(400).json({
                message: "User or email address already exist.",
              });
            else {
              new UserSchema(user)
                .save()
                .then(() => {
                  const use = module.exports;
                  use.changeEtat(user.entreprise, res, next);
                })
                .catch((error) => {
                  next(error);
                });
            }
          });
        })
        .catch((error) => {
          next(error);
        });
    }
  },

  /* ------------------------ Rentre l'entreprise invibles ----------------------- */
  makeInvisible: (req, res, next) => {
    Entreprise.findById(req.body._id)
      .then((find) => {
        if (!find)
          res.status(400).json({
            message: "Entreprise no Found.",
          });
        else {
          find
            .update({ etat: !etat })
            .then((updated) => {
              res.status(200).json({
                message: "Entreprise deleted.",
                updated,
              });
            })
            .catch((error) => {
              next(error);
            });
        }
      })
      .catch((error) => {
        next(error);
      });
  },

  /* ------------------------ verify code confirmation ------------------------ */
  verifyCode: async (req, res, next) => {
    console.log(req.body);
    await Entreprise.findOne({ _id: req.body.entreprise, code: req.body.code })
      .then((verify) => {
        if (verify)
          res.status(200).json({
            message: "correct code.",
          });
        else throw createError.NotFound("Incorrect code.");
      })
      .catch((error) => {
        next(error);
      });
  },
  sendEmail: async (req, res, next) => {
    await Entreprise.findOne({ _id: req.body.entreprise }).then((find) => {
      if (find) {
        const values = {
          to: find.mail,
          subject: "Test mail api",
          message: `Votre code de confirmation est ${find.code}`,
        };
        console.log(values);
        sendEmail(values, res, next);
      } else throw createError.NotFound("Email address not registered.");
    });
  },
};
