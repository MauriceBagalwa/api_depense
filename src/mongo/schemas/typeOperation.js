const mongose = require("mongoose");
const Schema = mongose.Schema;

const request = {
  type: String,
  required: true,
};

const TypeOperation = new Schema({
  designation: request,
  entreprise: request,
  createAt: { type: Date, default: Date.now },
});

const TypeoperationSchema = mongose.model("typeOperation", TypeOperation);

module.exports = TypeoperationSchema;
