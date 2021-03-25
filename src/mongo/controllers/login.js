const { findOne } = require("../schemas/user-schema");
const user = require("../schemas/user-schema");
module.exports = {
  login: async (req, res, next) => {
    const { username } = req.body;
    await findOne({ username })
      .then((find) => {
        next();
      })
      .catch((err) => {
        next(err);
      });
  },
};
