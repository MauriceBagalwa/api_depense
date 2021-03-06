const db = require("../mongo/schemas/function-schema");
module.exports = {
  isExist: async (req, res, next) => {
    const { entreprise, designation } = req.body;
    await db
      .findOne({ entreprise, designation })
      .then((find) => {
        if (find) {
          res.status(409).json({
            code: 409,
            message: "Function already exist.",
          });
        } else {
          next();
        }
      })
      .catch((err) => {
        next(err);
      });
  },
  isExistUpdate: async (req, res, next) => {
    console.log(req.body);
    const { entreprise, designation, description } = req.body;
    await db
      .findOne({
        entreprise,
        $or: [{ designation }, { description }],
        _id: { $ne: req.body._id },
      })
      .then((find) => {
        if (find) {
          res.status(409).json({
            code: 409,
            message: "Function already exist.",
          });
        } else {
          next();
        }
      })
      .catch((err) => {
        next(err);
      });
  },
};
