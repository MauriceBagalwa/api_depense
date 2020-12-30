const db = require("../schemas/function-schema");
module.exports = {
  /* ----------------------------- get all function of one entreprise ---------------------------- */

  functions: async (req, res, next) => {
    await db
      .find({ deleted: false, entreprise: req.body.entreprise })
      .then((find) => {
        res.send({
          code: 200,
          result: find,
        });
      })
      .catch((err) => {
        next(err);
      });
  },

  /* --------------------------- add a function with id pof entreprise -------------------------- */

  function: async (req, res, next) => {
    const { entreprise, designation } = req.body;
    const find = await db.findOne({ entreprise, designation });
    if (find)
      res.send({
        code: 409,
        message: "The designation already exists",
      });
    else {
      const use = module.exports;
      const newfunction = new db({
        entreprise: entreprise,
        designation: designation,
      });
      await newfunction
        .save()
        .then(() => {
          use.functions(req, res, next);
        })
        .catch((err) => {
          next(err);
        });
    }
  },
  /* --------------------------- update one function -------------------------- */
  update: async (req, res, next) => {
    const filter = { _id: req.body._id };
    await db
      .findOneAndUpdate(filter, req.body.designation)
      .then((update) => {
        if (update) {
          res.send({
            code: 200,
            message: "Fonction upadte succeful",
          });
        } else {
          res.send({
            code: 409,
            message: "Designation no found.",
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  },
  /* --------------------------- update one function -------------------------- */
  delete: async (req, res, next) => {
    const query = {};

    await db
      .findByIdAndDelete({ _id: req.body._id })
      .then((delted) => {
        if (delted)
          res.send({
            code: 200,
            message: "Fonction deleted succeful",
          });
        else
          res.send({
            code: 409,
            message: "Function no Found.",
          });
      })
      .catch((err) => {
        next(err);
      });
  },
};
