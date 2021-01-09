const db = require("../schemas/autorization_schema");
module.exports = {
  /* ------------------------- #selection des opération ------------------------ */

  typeOperations: async (req, res, next) => {
    db.find(deleted != false)
      .then((finds) => {
        res.send({
          status: 200,
          message: finds,
        });
      })
      .catch((err) => {
        next(err);
      });
  },

  /* ------------------- #ajout d'un nouveau type d'operation ------------------ */

  typeOperation: async (req, res, next) => {
    const values = {
      designation: req.body.designation,
      users: req.body.users,
    };
    await db
      .create(values)
      .then(() => {
        const use = module.exports;
        use.typeOperation(req, res, next);
      })
      .catch((err) => {
        next(err);
      });
  },

  /* -------------------------------------------------------------------------- */
  /*                    #Moidification d'un type d'operation                    */
  /* -------------------------------------------------------------------------- */

  updateDesignation: async (req, res, next) => {
    const filter = { _id: req.body._id };
    const update = { designation: req.body.designation };
    await db
      .findOneAndUpdate(filter, update, { returnOriginal: false })
      .then((updated) => {
        res.send({
          status: 200,
          message: updated,
        });
      });
  },

  UpdateUser: async (req, res, next) => {
    const filter = { _id: req.body._id };
    const update = { users: req.body.designation };
    await db
      .findOneAndUpdate(filter, update, { returnOriginal: false })
      .then((updated) => {
        res.send({
          status: 200,
          message: updated,
        });
      });
  },

  /* -------------------------------------------------------------------------- */
  /*                                 #Suppresion                                */
  /* -------------------------------------------------------------------------- */
  deleteOperation: async (req, res, next) => {
    db.findByIdAndDelete(req.params._id)
      .then(() => {
        res.send({
          status: 200,
          message: "Type Operation effacer avec succès.",
        });
      })
      .catch((err) => {
        next(err);
      });
  },
};
