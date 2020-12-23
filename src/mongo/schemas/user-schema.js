const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const reqString = {
  type: String,
  required: true,
};

const fonctionSchema = new Schema({
  designation: reqString,
});
const entreprise = "TestEnt-0034";
const UserSchema = new Schema({
  lastname: reqString,
  name: reqString,
  genre: reqString,
  number: reqString,
  email: reqString,
  password: reqString,
  entreprise_: { tyrpe: String, default: entreprise },
  fonctions: [fonctionSchema],
  etat: { type: Boolean, default: true },
  creatAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
