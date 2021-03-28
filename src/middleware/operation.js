const db = require("../mongo/schemas/operation");
const { use } = require("../routers/user-router");
const controller = require("../mongo/controllers/operation");
module.exports = {
  isExist: async (req, res, next) => {
    console.log(req.body);
    const { id, designation, entreprise, description, type } = req.body;

    await db
      // .findOne({ designation, entreprise, description })
      .findOne({
        $and: [{ designation }, { entreprise }, { _id: { $ne: id } }],
      })
      .then((find) => {
        if (find) {
          res.status(409).json({ message: "Operation already Exist." });
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
