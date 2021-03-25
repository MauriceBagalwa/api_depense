const db = require("../mongo/schemas/entreprise-Schema");
const fonction = require("../mongo/schemas/function-schema");
const User = require("../mongo/schemas/user-schema");
module.exports = {
  isExist: async (req, res, next) => {
    const { rccm, mail, name } = req.body;
    console.log(req.body);
    await db
      .findOne({
        $and: [
          { _id: { $ne: req.body._id }, $or: [{ rccm }, { mail }, { name }] },
        ],
      })
      .then((exist) => {
        if (exist) {
          res.status(409).json({
            erro: "Conflit.",
            doby: exist,
          });
        } else next();
      })
      .catch((error) => {
        next();
      });
  },
  defaultFunction: async (req, res, next) => {
    const newfunction = new fonction({
      entreprise: req.body.entreprise,
      designation: "Super admin",
      description: "le super admin a le controller absolue sue l'application.",
    });
    await newfunction
      .save()
      .then((create) => {
        req.body.fonction = create._id;
        next();
      })
      .catch((err) => {
        next(err);
      });
  },
};
