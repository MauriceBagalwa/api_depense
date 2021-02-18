const db = require("../schemas/function-schema");
module.exports = {
  /* ----------------------------- get all function of one entreprise ---------------------------- */

  functions: async (req, res, next) => {
    const { entreprise } = req.query;
    await db
      .find({ deleted: false, entreprise })
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
  refrech: async (req, res, next) => {
    const { entreprise } = req.query;
    await db
      .find(
        {
          deleted: false,
          entreprise,
        },
        { designation: 1 }
      )
      .sort({ addedOn: 1 })
      .then((find) => {
        res.send({
          find,
        });
      })
      .catch((err) => {
        next(err);
      });
  },

  /* --------------------------- add a function with id pof entreprise -------------------------- */

  function: async (req, res, next) => {
    console.log(req.body);
    const { entreprise, designation, description } = req.body;
    const find = await db.findOne({ entreprise, designation });
    if (find)
      res.send({
        code: 409,
        message: "The designation already exists",
      });
    else {
      const newfunction = new db({
        entreprise: entreprise,
        designation: designation,
        description: description,
      });
      await newfunction
        .save()
        .then((create) => {
          console.log(create.query);
          res.send(create);
        })
        .catch((err) => {
          next(err);
        });
    }
  },
  /* --------------------------- update one function -------------------------- */
  update: async (req, res, next) => {
    const filter = { _id: req.body._id };
    console.log(req.body);
    const body = {
      designation: req.body.designation,
      description: req.body.description,
    };
    await db
      .findOneAndUpdate(filter, body)
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
    console.log(req.query);
    await db
      .findByIdAndDelete({ _id: req.query.id })
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
