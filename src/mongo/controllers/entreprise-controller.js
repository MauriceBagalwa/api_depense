const Entreprise = require("../schemas/entreprise-Schema");
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

  /* --------------------------- add new entreprise --------------------------- */
  entreprise: (req, res, next) => {
    const { name, rccm, mail, numbers, adresses } = req.body;
    Entreprise.findOne({ $or: [{ name }, { mail }] }).then((find) => {
      console.log(find);
      if (find)
        res.status(400).json({
          message: "Entreprise or email address already exist.",
        });
      else {
        // @ init values of body
        const entreprise = new Entreprise({
          name: name,
          rccm: rccm,
          mail: mail,
          numbers: numbers,
          adresses: adresses,
        });
        if (req.file) {
          entreprise.avatar = req.file.path;
        }
        entreprise
          .save()
          .then(function () {
            res.status(200).json({
              message: "Entreprise create.",
            });
          })
          .catch((error) => {
            next(error);
          });
      }
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
