const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

var randomFixedInteger = function (length) {
  return Math.floor(
    Math.pow(10, length - 1) +
      Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
  );
};

const reqString = {
  type: String,
  required: true,
};

const role = new Schema({
  designation: reqString,
});

const UserSchema = new Schema({
  lastname: reqString,
  name: reqString,
  genre: reqString,
  number: reqString,
  email: reqString,
  password: reqString,
  entreprise: reqString,
  fonction: { type: Schema.Types.ObjectId, ref: "Function" },
  username: { type: String, default: "@?" },
  roles: [role],
  etat: { type: Boolean, default: true },
  creatAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(this.password, salt);
    this.password = hashedPassword;
    this.username = `${this.lastname}@${randomFixedInteger(4)}`;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;
