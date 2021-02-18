const db = require("../schemas/operation");
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
      users: req.body.users,
    });
    await operation
      .save()
      .then(() => {
        console.log("#2 insertion...");
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
    };
    await db
      .findOneAndUpdate(filter, update, { returnOriginal: false })
      .then((updated) => {
        next();
      });
  },

  UpdateUser: async (req, res, next) => {
    console.log(req.body);
    const filter = { _id: req.body.id };
    const update = { users: req.body.users };
    await db
      .findOneAndUpdate(filter, update, { returnOriginal: false })
      .then((updated) => {
        if (updated) {
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
