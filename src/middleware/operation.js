const db = require("../mongo/schemas/operation");
const { use } = require("../routers/user-router");
module.exports = {
  isExist: async (req, res, next) => {
    console.log(req.body);
    const { designation, entreprise, description } = req.body;
    await db
      .findOne({ designation, entreprise, description })
      .then((find) => {
        if (find) {
          // const use = module.exports;
          // use.operations(req, res, next);
          res.statut(409).json({
            message: "l'operation exist deja.",
          });
        } else {
          console.log("#mouveau");
          next();
        }
      })
      .catch((error) => {
        next(error);
      });
  },
  operations: async (req, res, next) => {
    console.log(req.body);
    await db
      .find({ entreprise: req.body })
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
};
