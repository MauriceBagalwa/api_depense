const userRouter = require("./user-router");
const entrepriseRouter = require("./entreprise-router");
const middleware = require("./middleware");
const functionRouter = require("./function-router");
const autorization = require("./autorization-router");

module.exports = {
  userRouter,
  entrepriseRouter,
  middleware,
  functionRouter,
  autorization,
};
