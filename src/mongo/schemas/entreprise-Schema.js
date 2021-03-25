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
const deviceSchema = new Schema({
  designation: { type: String },
  symbole: { type: String },
  taux: { type: Number },
});
const contrydeviceSchema = new Schema({
  designation: reqString,
  symbole: reqString,
});

const EntrepriseSchema = new Schema({
  name: reqString,
  rccm: reqString,
  mail: reqString,
  number: reqString,
  adresse: reqString,
  contrydevice: contrydeviceSchema,
  devices: [deviceSchema],
  created: { type: Boolean, default: false },
  code: { type: String, default: "-" },
  etat: { type: Boolean, default: true },
  creatAt: { type: Date, default: Date.now },
});

// EntrepriseSchema.pre("updateOne", async function (next) {
//   try {
//     const data = await this.model.findOne(this.getQuery());
//     console.log(data);
//     next();
//   } catch (error) {
//     console.log(error);
//   }
// });

// const user = await User.updateOne({ _id: req.params.id }, req.body);

const Entreprise = mongoose.model("Entreprise", EntrepriseSchema);

module.exports = Entreprise;
