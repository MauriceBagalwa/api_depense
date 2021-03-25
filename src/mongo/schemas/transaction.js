const mongose = require("mongoose");
const Schema = mongose.Schema;

const request = {
  type: String,
  required: true,
};

const deviceSchema = new Schema({
  designation: { type: String },
  symbole: { type: String },
});
const deviceOPSchema = new Schema({
  designation: { type: String },
  symbole: { type: String },
  taux: { type: Number },
});
const userSchema = new Schema({
  user: { type: Schema.Types.ObjectID, ref: "Users" },
  etat: { type: Boolean, default: false },
});

const Transaction = new Schema({
  entreprise: { type: Schema.Types.ObjectId, ref: "Entreprise" },
  deviseoperation: deviceOPSchema,
  montant: { type: Number, required: true },
  operation: { type: Schema.Types.ObjectId, ref: "Operations" },
  devise: deviceSchema,
  libele: { type: String },
  declencheur: { type: Schema.Types.ObjectID, ref: "Users" },
  users: [userSchema],
  date: request,
  etat: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now },
});

const TransactionSchema = mongose.model("Transaction", Transaction);

module.exports = TransactionSchema;
