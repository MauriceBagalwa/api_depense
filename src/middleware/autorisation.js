const db = require("../mongo/schemas/autorization_schema");
const { use } = require("../routers/user-router");
module.exports = {
  isExist: async (res, req, next) => {
    const { designation, entreprise } = req.body;
    const filtre = { designation: designation, entreprise: entreprise };
    const values = { designation: designation, entreprise: entreprise };
    await db
      .findOneAndUpdate({ filtre, values })
      .then((find) => {
        if (find) {
          const use = module.exports;
          use.operation(req, res, next);
        } else {
          next();
        }
      })
      .cacth((error) => {
        next(error);
      });
  },
  operation: async (res, res, next) => {
    await db
      .find({ entreprise: req.body.entreprise })
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
