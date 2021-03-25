const db = require("../schemas/user-schema");
const username = require("username");
const { SendGridUserMail } = require("../utils/elementary");
module.exports = {
  signin: async (req, res, next) => {
    const { username } = req.body;
    await db
      .findOne({ username })
      .then((find) => {
        if (find) {
          req.body = find;
          next();
        } else {
          res.status(400).json({
            message: "user or password incorrect",
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  },
  users: async (req, res, next) => {
    const { entreprise } = req.query;
    await db
      .find({ entreprise })
      .populate({
        path: "fonction",
        select: "designation",
      })
      // .populate("entreprise")
      .sort({ createAt: 1 })
      .then((find) => {
        res.send({ find });
      })
      .catch((error) => {
        next(error);
      });
  },
  userwithId: async (req, res, next) => {
    const { entreprise, email } = req.body;
    await db
      .findOne({ entreprise, email })
      .sort({ createAt: 1 })
      .then((find) => {
        req.body = find;
        next();
      })
      .catch((error) => {
        next(error);
      });
  },

  /*@creatio d'un 
       utilisateur
     */

  /* ------------------------------- Creation ------------------------------- */

  user: async (req, res, next) => {
    const user = new db({
      lastname: req.body.lastname,
      name: req.body.name,
      genre: req.body.genre,
      email: req.body.email,
      password: req.body.password,
      number: req.body.number,
      entreprise: req.body.entreprise,
      fonction: req.body.fonction,
      roles: req.body.roles,
    });

    await user
      .save()
      .then(function (create) {
        if (create) {
          req.body = create;
          next();
        }
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  },
  /* ------------------------------- Update user ------------------------------- */
  upadte: async (req, res, next) => {
    const filter = { _id: req.body._id };
    console.log(filter);
    const values = req.body;

    await db
      .findByIdAndUpdate(filter, values)
      .then(() => {
        res.send({
          code: 200,
          message: "User update succeful.",
        });
      })
      .catch((err) => {
        next(err);
      });
  },

  /*#2
   * #Modification de l'etat du compte de l'utilisateur
   */
  updateCount: async (req, res, next) => {
    const filter = { _id: req.body._id };
    const values = {
      etat: req.body.etat,
      fonction: req.body.fonction,
      roles: req.body.roles,
    };
    console.log(values);
    await db
      .findByIdAndUpdate(filter, values)
      .then((config) => {
        next();
      })
      .catch((err) => {
        next(err);
      });
  },
  /* ------------------------------ Delete a user ----------------------------- */
  delte: async (req, res, next) => {
    console.log(req.query.user);
    await db
      .findByIdAndDelete({ _id: req.query.user })
      .then((delted) => {
        if (delted)
          res.send({
            code: 200,
            message: "User deleted succeful",
          });
        else
          res.send({
            code: 409,
            message: "User no Found.",
          });
      })
      .catch((err) => {
        next(err);
      });
  },
  Usermail: async (req, res, next) => {
    const { username, email, entreprise } = req.body;
    const values = {
      username,
      email,
      entreprise,
    };
    SendGridUserMail(values, res, next);
  },
};
