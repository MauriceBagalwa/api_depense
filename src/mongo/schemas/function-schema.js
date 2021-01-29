const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqstring = {
  type: String,
  required: true,
};

const FunctionSchema = new Schema({
  entreprise: reqstring,
  designation: reqstring,
  description: reqstring,
  deleted: { type: Boolean, default: false },
  creatAt: { type: String, default: Date.now },
});

const Function = mongoose.model("Function", FunctionSchema);

module.exports = Function;
