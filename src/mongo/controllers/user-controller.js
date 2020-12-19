const User = require("../schemas/user-schema");

module.exports = {
  /*@creatio d'un 
       utilisateur
     */
  user: (req, res, next) => {
    const mails = req.mails;
    const { lastname, name };
    User.find({ where: { lastname, name } }).then((find) => {
      if (find)
        res.status(400).json({
          message: "users already exist",
        });
      else {
        res.status(200).json({
          message: "users created exist",
          data: find,
        });
      }
    });
  },
};
