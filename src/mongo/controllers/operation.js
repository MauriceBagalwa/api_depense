const db = require("../schemas/operation");
const { upadte } = require("./user-controller");
module.exports = {
  /* ------------------------- #selection des opération ------------------------ */

  Operations: async (req, res, next) => {
    await db
      .find({ entreprise: req.query.entreprise })
      .populate({
        path: "users",
        select: "lastname name email fonction",
        populate: {
          path: "fonction",
          select: "designation",
        },
      })
      .then((operations) => {
        res.send({
          operations,
        });
      })
      .catch((error) => {
        next(error);
      });
  },

  /* ------------------- #ajout d'un nouveau type d'operation ------------------ */

  Operation: async (req, res, next) => {
    const operation = new db({
      designation: req.body.designation,
      entreprise: req.body.entreprise,
      description: req.body.description,
      type: req.body.type,
      users: req.body.users,
    });
    await operation
      .save()
      .then((saved) => {
        req.body = saved.entreprise;
        next();
      })
      .catch((err) => {
        next(err);
      });
  },

  /* -------------------------------------------------------------------------- */
  /*                    #Moidification d'un type d'operation                    */
  /* -------------------------------------------------------------------------- */

  update: async (req, res, next) => {
    console.log(req.body);
    const filter = { _id: req.body.id };
    const update = {
      designation: req.body.designation,
      description: req.body.description,
      type: req.body.type,
    };
    await db
      .findOneAndUpdate(filter, update, { returnOriginal: false })
      .then((updated) => {
        req.body = updated.entreprise;
        next();
      });
  },

  UpdateUser: async (req, res, next) => {
    const filter = { _id: req.body.id };
    const update = { users: req.body.users };
    await db
      .findOneAndUpdate(filter, update, { returnOriginal: false })
      .then((updated) => {
        if (updated) {
          req.body = updated.entreprise;
          console.log(updated);
          next();
        }
      })
      .catch((error) => {
        next(error);
      });
  },

  /* -------------------------------------------------------------------------- */
  /*                                 #Suppresion                                */
  /* -------------------------------------------------------------------------- */
  deleteOperation: async (req, res, next) => {
    db.findByIdAndDelete({ _id: req.query.id })
      .then((find) => {
        if (find) {
          console.log(find);
          res.send({
            status: 200,
            message: "Type Operation effacer avec succès.",
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  },
};
