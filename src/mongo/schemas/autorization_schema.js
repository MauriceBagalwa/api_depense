const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reqString = {
  type: String,
  required: true,
};

const userSchema = Schema({
  user: reqString,
});

const autorizationSchema = Schema({
  designation: reqString,
  users: [userSchema],
  deleted: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now },
});

const Autorization = mongoose.model("autorization", autorizationSchema);

module.exports = Autorization;
