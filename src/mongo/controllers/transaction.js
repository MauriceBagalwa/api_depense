const db = require("../schemas/transaction");
const operation_ = require("../schemas/operation");
const moment = require("moment");

function findIndexByProperty(data, value) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].user == value) {
      data[i].etat = true;
    }
  }
  return data;
}

function Finished(data) {
  let do_ = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].etat == true) {
      do_++;
    }
  }
  return do_ == data.length;
}

module.exports = {
  transaction: async (req, res, next) => {
    const {
      devise,
      deviseoperation,
      montant,
      operation,
      libele,
      declencheur,
      entreprise,
      date,
    } = req.body;

    const find = await operation_.findOne({ _id: operation });
    if (find) {
      const users = find.users.map(function (option) {
        return { user: option };
      });
      const transValue = new db({
        devise,
        montant,
        deviseoperation,
        operation,
        users,
        libele,
        declencheur,
        entreprise,
        date,
      });

      await transValue
        .save()
        .then((created) => {
          if (created) {
            res.send(created);
          } else {
            res.send({ message: "transction not create." });
          }
        })
        .catch((error) => {
          next(error);
        });
    } else {
      res.status(400).json({
        message: "Operation not Found.",
      });
    }
  },
  transactions: async (req, res, next) => {
    const { entreprise } = req.body;
    console.log(req.query);
    await db
      .find({ entreprise })
      .populate({
        path: "operation",
        select: "designation description type",
        _id: 0,
      })
      .populate({ path: "users.user" })
      .populate({
        path: "declencheur",
        select: "username lastname name genre email number",
      })
      .then((find) => {
        res.status(200).json({ find });
      })
      .catch((err) => {
        next(err);
      });
  },
  findTransaction: async (req, res, next) => {
    const { entreprise, user } = req.query;

    await db
      .find({ $and: [{ entreprise: entreprise }, { "users.user": user }] })
      .populate({
        path: "operation",
        select: "designation description type",
        _id: 0,
      })
      .populate({ path: "users.user" })
      .populate({ path: "declencheur" })
      .populate({
        path: "users.user",
        select: "username lastname name genre email number",
      })
      .then((find) => {
        res.status(200).json({ find });
      })
      .catch((err) => {
        next(err);
      });
  },

  Notification: async (req, res, next) => {
    const { entreprise, user } = req.body;
    console.log(req.query);
    await db

      .find({
        $and: [
          { entreprise: entreprise },
          { "users.user": user },
          { "users.etat": false },
        ],
      })
      .populate({
        path: "operation",
        select: "designation description type",
        _id: 0,
      })
      .populate({ path: "users.user" })
      .populate({ path: "declencheur" })
      .populate({
        path: "users.user",
        select: "username lastname name genre email number",
      })
      .then((find) => {
        res.status(200).json({ find });
      })
      .catch((err) => {
        next(err);
      });
  },

  findUsers: async (req, res, next) => {},
  valideTransaction: async (req, res, next) => {
    const { user, _id } = req.body;
    const trans = await db.findOne({ _id });
    console.log(_id, user);
    if (trans) {
      const value = {
        users: findIndexByProperty(trans.users, user),
        etat: Finished(trans.users),
      };
      await trans
        .update(value)
        .then(() => {
          next();
        })
        .catch((err) => {
          next(err);
        });

      //
    } else {
      res.status(400).json({ message: "Entreprise not Found." });
    }
  },
  /* -------------------------------- DashBord -------------------------------- */
  DashData: async (req, res, next) => {
    const { entreprise } = req.body;

    // let dte = moment().subtract(2, "days").calendar();
    // let today = moment(dte).format();
    // let today = moment().format();
    // let dash = await db.find({ entreprise, etat: true });
    // var today = new Date().toISOString();

    var today = new Date();
    today.setDate(today.getDate() - 7);

    let dash = await db.find(
      {
        entreprise,
        etat: true,
        createAt: { $gte: new Date(today) },
      },
      {
        $group: {
          "_id":{ $createAt: "$createAt" },
        },
      }
    );

    if (dash) {
      res.status(200).json({
        dash,
        date: today,
      });
    } else {
      res.status(400).json({
        message: "someThing went wrong.",
      });
    }
  },
};
