const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const reqString = {
  type: String,
  required: true,
};

const fonctionSchema = new Schema({
  designation: reqString,
  creatAt: { type: Date, default: Date.now },
});

const UserSchema = new schema({
  latsname: reqString,
  name: reqString,
  genre: reqString,
  mails: reqString,
  password: reqString,
  fonctions: [fonctionSchema],
  creatAt: { type: Date, default: Date.now },
});

UserSchema.pre("Save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(this.password, salt);
    this.password = hashedPassword;
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
