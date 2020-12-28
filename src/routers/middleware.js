const entrepriseCtr = require("../mongo/controllers/entreprise-controller");
const router = require("express").Router();
router.get("/", entrepriseCtr.verifyMailEntreprise);
module.exports = router;
