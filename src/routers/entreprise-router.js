const entrepriseCtr = require("../mongo/controllers/entreprise-controller");
const router = require("express").Router();
const upload = require("../middleware/upload");


router.get("/", entrepriseCtr.entreprisesOperation);
router.get("/code", entrepriseCtr.verifyCode);
router.get("/mail", entrepriseCtr.sendEmail);

router.post("/", entrepriseCtr.entreprise);
router.put("/", entrepriseCtr.updateEntreprise);

module.exports = router;
