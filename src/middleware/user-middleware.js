const db = require("../mongo/schemas/user-schema");
module.exports = {
  userExist: async (req, res, next) => {
    const { name, lastname, email, entreprise } = req.body;
    await db
      .findOne({
        $or: [
          { $and: [{ entreprise, email }] },
          { $and: [{ entreprise, name, lastname }] },
        ],
      })
      .then((exist) => {
        if (exist) {
          console.log(exist);
          res.send({
            code: 409,
            message: "User or email already exists",
          });
        } else next();
      });
  },
  username: (name) => {
    `${name}@`;
  },
  getUser: async (req, res, next) => {
    const { entreprise } = req.body;
    await db
      .find({ entreprise })
      .populate({
        path: "fonction",
        select: "designation",
      })
      .sort({ createAt: -1 })
      .then((find) => {
        res.send({ find });
      })
      .catch((error) => {
        next(error);
      });
  },
};
