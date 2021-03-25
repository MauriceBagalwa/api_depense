const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeviseSchema = new Schema({
  designation: { type: String },
  symbole: { type: String },
  taux: { type: String },
});
const Devise = mongoose.model("Devise", DeviseSchema);

module.exports = Devise;
