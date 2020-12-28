const entrepriseCtr = require("../mongo/controllers/entreprise-controller");
const router = require("express").Router();
const upload = require("../middleware/upload");

router.get("/", entrepriseCtr.entreprisesOperation);
router.get("/middleware", entrepriseCtr.verifyMailEntreprise);
router.get("/mail", entrepriseCtr.sendEmail);

router.post("/", entrepriseCtr.entreprise);
router.post("/updatemail", entrepriseCtr.updateMail);
router.post("/code", entrepriseCtr.verifyCode);

router.put("/", entrepriseCtr.updateEntreprise);

module.exports = router;
