const db = require("../schemas/user-schema");
const username = require("username");

module.exports = {
  users: async (req, res, next) => {
    const { entreprise } = req.query;
    await db
      .find({ etat: true, entreprise })
      .populate({
        path: "fonction",
        select: "designation",
      })
      .sort({ createAt: 1 })
      .then((find) => {
        res.send({ find });
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
    });

    await user
      .save()
      .then(function (create) {
        if (create) next();

        // console.log(find);

        // find.
        // find.populate({ path: "fonction", select: { designation: 1 } });
        // res.send({
        //   find,
        // });
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
    const values = {
      lastname: req.body.lastname,
      name: req.body.name,
      genre: req.body.genre,
      email: req.body.email,
      password: req.body.password,
      number: req.body.number,
      entreprise: req.body.entreprise,
      fonction: req.body.fonctions,
    };

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

  /* ------------------------------ Delete a user ----------------------------- */
  delte: async (req, res, next) => {
    await db
      .findByIdAndDelete({ _id: req.body._id })
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
};
