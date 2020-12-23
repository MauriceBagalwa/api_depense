const Entreprise = require("../schemas/entreprise-Schema");
const UserSchema = require("../schemas/user-schema");

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

  changeEtat: (entreprise, res, next) => {
    Entreprise.findById((_id = entreprise)).then((find) => {
      console.log(find);
      if (find)
        find
          .update({ created: true })
          .then(function () {
            res.status(400).json({
              message: "Entreprise created...",
            });
          })
          .catch((error) => {
            next(error);
          });
      else {
        res.status(400).json({
          message: "Entreprise not created",
        });
      }
    });
  },
  /* --------------------------- add new entreprise --------------------------- */
  entreprise: (req, res, next) => {
    const { name, rccm, mail, number, adresse, user } = req.body;
    console.log(req.body);
    Entreprise.findOne({
      $and: [{ created: true }, { $or: [{ name }, { mail }] }],
    }).then((find) => {
      console.log(find);

      if (find)
        res.status(400).json({
          message: "Entreprise or email address already exist.",
        });
      else {
        const values = new Entreprise({
          name: name,
          rccm: rccm,
          mail: mail,
          number: number,
          adresse: adresse,
        });

        values
          .save()
          .then((created) => {
            user.entreprise = created._id;
            new UserSchema(user)
              .save()
              .then(() => {
                const use = module.exports;
                use.changeEtat(user.entreprise, res, next);
              })
              .catch((error) => {
                next(error);
              });
          })
          .catch((error) => {
            console.log(error);
            next(error);
          });
      }
    });
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
};
