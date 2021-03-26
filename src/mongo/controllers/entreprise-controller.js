const Entreprise = require("../schemas/entreprise-Schema");
const UserSchema = require("../schemas/user-schema");
const createError = require("http-errors");
const {
  sendEmail,
  SendGridMail,
  SendGridUserMail,
} = require("../utils/elementary");

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
    // const { _id } = req.query;
    Entreprise.find()
      .then((find) => {
        res.status(200).json(find);
      })
      .catch((error) => {
        next(error);
      });
  },
  /*@2 */
  // entreprisesOperation: (req, res, next) => {
  //   Entreprise.findOne({ _id: "5fe83a33deeaa704b817a3a5" })
  //     .then((find) => {
  //       const value = {
  //         _id: find._id,
  //         name: find.name,
  //         rccm: find.rccm,
  //         number: find.number,
  //         mail: find.mail,
  //         adresse: find.adresse,
  //         code: find.code,
  //         creatAt: find.creatAt,
  //       };
  //       res.status(200).json(value);
  //     })
  //     .catch((error) => {
  //       next(error);
  //     });
  // },
  /* ------------------------ update data of entreprise ----------------------- */
  updateEntreprise: (req, res, next) => {
    const filter = { _id: req.body._id };
    const values = {
      name: req.body.name,
      rccm: req.body.rccm,
      mail: req.body.mail,
      number: req.body.number,
      adresse: req.body.adresse,
    };
    Entreprise.findOneAndUpdate(filter, values)
      .then((updated) => {
        res.status(200).json(updated);
      })
      .catch((error) => {
        next(error);
      });

    // console.log(values);
    // Entreprise.findById(values._id).then((find) => {
    //   if (!find)
    //     res.status(400).json({
    //       message: "Entreprise no Found.",
    //     });
    //   else {
    //     find
    //       .update(values)
    //       .then((updated) => {
    //         res.status(200).json({
    //           message: "Data update.",
    //           updated,
    //         });
    //       })
    //       .catch((error) => {
    //         next(error);
    //       });
    //   }
    // });
  },

  changeEtat: async (req, res, next) => {
    const filter = { _id: req.body.entreprise };
    const values = { created: true };
    const { username, _id, email } = req.body;

    await Entreprise.findByIdAndUpdate(filter, values)
      .then((update) => {
        const values = {
          username,
          email,
          _id,
        };
        SendGridUserMail(values, res, next);
      })
      .catch((error) => {
        next(error);
      });
  },
  /* --------------------------- add new entreprise --------------------------- */

  entreprise: async (req, res, next) => {
    const { name, rccm, mail, number, adresse, user, contrydevice } = req.body;

    const find = await Entreprise.findOne({
      $and: [{ created: true }, { $or: [{ name }, { mail }] }],
    }).catch((error) => {
      next(error);
    });

    if (find)
      res.send({
        message: "Entreprise or email address already exist.",
      });
    else {
      const entreprise = new Entreprise({
        name: name,
        rccm: rccm,
        mail: mail,
        number: number,
        adresse: adresse,
        contrydevice: contrydevice,
        code: randomFixedInteger(6),
      });

      await entreprise
        .save()
        .then((created) => {
          user.entreprise = created._id;
          req.body = user;
          next();
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
    await Entreprise.findOne({
      _id: req.body.entreprise,
      code: req.body.code,
    })
      .then((verify) => {
        if (verify) {
          next();
        } else
          res.status(400).json({
            message: "Incorrect code.",
          });
      })
      .catch((error) => {
        next(error);
      });
  },

  /* ---------------- Envoir de mail avec code de confirmation ---------------- */

  sendEmail: async (req, res, next) => {
    await Entreprise.findOne({ _id: req.body.entreprise }).then((find) => {
      if (find) {
        const values = {
          to: find.mail,
          subject: "Test mail api",
          message: `Votre code de confirmation est ${find.code}`,
        };

        sendEmail(values, res, next);
      } else
        res.send({
          code: 400,
          message: "Entreprise no Found",
        });
    });
  },
  Email: async (req, res, next) => {
    const { entreprise } = req.body;
    await Entreprise.findOne({ _id: entreprise })
      .then((find) => {
        if (find) {
          const values = {
            mail: find.mail,
            code: find.code,
            entreprise: find._id,
          };
          SendGridMail(values, res, next);
        } else {
          console.log("Entreprise no found.");
          res.status(400).json({
            status: 400,
            message: "Entreprise no found.",
          });
        }
      })
      .catch((error) => {
        next(error);
      });
  },
  EmailQuery: async (req, res, next) => {
    const { entreprise } = req.query;
    await Entreprise.findOne({ _id: entreprise })
      .then((find) => {
        if (find) {
          const values = {
            mail: find.mail,
            code: find.code,
            entreprise: find._id,
          };
          SendGridMail(values, res, next);
        } else {
          console.log("Entreprise no found.");
          res.status(400).json({
            status: 400,
            message: "Entreprise no found.",
          });
        }
      })
      .catch((error) => {
        next(error);
      });
  },

  /* -------------------------- Modification du mail -------------------------- */

  updateMail: async (req, res, next) => {
    console.log(req.body);
    const { entreprise, mail } = req.body;
    await Entreprise.findOne({ _id: entreprise })
      .then((find) => {
        if (find) {
          Entreprise.findOne({ mail })
            .then((exist) => {
              if (exist)
                res.send({
                  code: 400,
                  message: `Email address already exist.`,
                });
              else {
                find
                  .updateOne({ mail })
                  .then((updated) => {
                    const values = {
                      mail: find.mail,
                      code: find.code,
                      entreprise: find._id,
                    };

                    SendGridMail(values, res, next);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      message: "Echec de la modification.",
                    });
                  });
              }
            })
            .catch((error) => {
              res.status(400).json({
                message: "Echec de la modification.",
              });
            });
        } else throw createError.NotFound("Entreprise not Found.");
      })
      .catch((error) => {
        next(error);
      });
  },
  verifyMailEntreprise: async (req, res, next) => {
    try {
      const { mail } = req.query;
      const find = await Entreprise.findOne({ created: true, mail });
      console.log(mail);
      if (find)
        res.send({
          code: 409,
          message: "mail",
        });
      else
        res.send({
          code: 200,
          message: "Autentique",
        });
    } catch (error) {
      console.log(error);
    }
  },
  Devise: async (req, res, next) => {
    const { designation, symbole, taux, entreprise } = req.body;
    const find = await Entreprise.findOne({
      _id: entreprise,
    });

    if (find) {
      const devices = find.devices;
      if (
        devices.find(
          (value) =>
            value.designation == designation || value.symbole == symbole
        )
      ) {
        res.status(409).json({
          message: "Designation or symbole is already exist.",
        });
      } else {
        const newdevise = {
          designation,
          symbole,
          taux,
        };
        devices.push(newdevise);

        const filter = {
          _id: entreprise,
        };
        const update = {
          devices,
        };
        await Entreprise.findOneAndUpdate(filter, update, {
          new: true,
        })
          .then((find) => {
            if (find) {
              res.status(200).json(find);
            }
          })
          .catch((error) => {
            next(error);
          });
      }
    } else {
      res.send({
        message: "Entreprise not Found.",
        find,
      });
    }
  },
  DeleDevise: async (req, res, next) => {
    const { id, entreprise } = req.query;
    console.log(req.query);
    const find = await Entreprise.findOne({
      _id: entreprise,
    });

    if (find) {
      const devices = find.devices;

      if (id > -1) {
        devices.splice(id, 1);
        console.log(devices);
        const filter = {
          _id: entreprise,
        };
        const update = {
          devices,
        };
        await Entreprise.findOneAndUpdate(filter, update, {
          new: true,
        })
          .then((find) => {
            if (find) {
              res.status(200).json(find);
            }
          })
          .catch((error) => {
            next(error);
          });
      } else {
        res.send({
          message: "devise not Found.",
        });
      }
    } else {
      res.send({
        message: "Entreprise not Found.",
        find,
      });
    }
  },
};
