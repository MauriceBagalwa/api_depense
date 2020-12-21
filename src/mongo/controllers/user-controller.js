const User = require("../schemas/user-schema");

module.exports = {
  users: (req, res, next) => {
    User.find()
      .then((find) => {
        res.status(200).json(find);
      })
      .catch((error) => {
        next(error);
      });
  },

  /*@creatio d'un 
       utilisateur
     */

  /* ------------------------------- Createtion ------------------------------- */

  user: async (req, res, next) => {
    try {
      const {
        lastname,
        name,
        genre,
        email,
        number,
        entreprise_,
        fonctions,
      } = req.body;
      const isExist = await User.findOne({ $or: [{ lastname }, { email }] });

      if (isExist) {
        res.status(400).json({
          message: "username or email address already exist",
        });
      } else {
        const values = new User({
          lastname: lastname,
          name: name,
          genre: genre,
          email: email,
          password: "1234",
          number: number,
          entreprise_: entreprise_,
          fonctions: fonctions,
        });
        await values
          .save()
          .then(function () {
            res.status(200).json({
              message: "users created.",
            });
          })
          .catch((error) => {
            next(error);
          });
      }
    } catch (error) {
      next(error);
    }
  },
};
