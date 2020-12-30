const db = require("../mongo/schemas/function-schema");
module.exports = {
  isExist: async (req, res, next) => {
    db.findOne({ designation: req.body.designation })
      .then((find) => {
        if (find) {
          res.send({
            code: 409,
            message: "Function already exist.",
          });
        } else next();
      })
      .catch((err) => {
        next(err);
      });
  },
};
