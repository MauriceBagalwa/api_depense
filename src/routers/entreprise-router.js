const entrepriseCtr = require("../mongo/controllers/entreprise-controller");
const router = require("express").Router();

router.get("/", entrepriseCtr.entreprisesOperation);
router.post("/", entrepriseCtr.entreprise);
router.put("/", entrepriseCtr.updateEntreprise);

module.exports = router;
