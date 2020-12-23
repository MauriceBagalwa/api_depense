const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqString = {
  type: String,
  required: true,
};

const NumberSchema = new Schema({
  number: reqString,
});
const locationSchema = new Schema({
  adress: reqString,
});

const EntrepriseSchema = new Schema({
  name: reqString,
  rccm: reqString,
  mail: reqString,
  number: reqString,
  adresse: reqString,
  created: { type: Boolean, default: false },
  etat: { type: Boolean, default: true },
  creatAt: { type: Date, default: Date.now },
});

const Entreprise = mongoose.model("entreprise", EntrepriseSchema);

module.exports = Entreprise;
