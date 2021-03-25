const { compare } = require("bcryptjs");
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
          res.status(409).json({
            message: "user already exist.",
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

  getUserID: async (req, res, next) => {
    const { _id } = req.body;
    await db
      .findOne({ _id })
      .populate("entreprise")
      .populate({
        path: "fonction",
        select: "designation",
      })
      .sort({ createAt: -1 })
      .then((find) => {
        if (find) {
          res.status(200).json(find);
        }
      })
      .catch((error) => {
        next(error);
      });
  },
  comparePsswd: async (req, res, next) => {
    const { _id, ancien, password } = req.body;
    console.log(req.body);
    await db
      .findOne({ _id })
      .then((user) => {
        const value = { password: password };
        if (user.comparePassword(ancien)) {
          db.findByIdAndUpdate({ _id }, value).then((update) => {
            res.status(200).json({
              ancien: "Mot de passe modifier avec succès.",
              body: user,
              body: update,
            });
          });

          // user.updateOne(password).then((update) => {
          //   res.status(200).json({
          //     ancien: "Mot de passe modifier avec succès.",
          //     body: user,
          //   });
          // });
        } else
          res.status(400).json({
            error: "invalid credentials",
          });
      })
      .catch((error) => {
        next(error);
      });
  },
};
