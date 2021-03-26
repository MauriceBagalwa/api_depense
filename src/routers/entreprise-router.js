const entrepriseCtr = require("../mongo/controllers/entreprise-controller");
const router = require("express").Router();
const upload = require("../middleware/upload");
const middleware = require("../middleware/entreprise");
const userMiddleware = require("../middleware/user-middleware");
const userCtr = require("../mongo/controllers/user-controller");

router.get("/", entrepriseCtr.entreprises);
router.get("/middleware", entrepriseCtr.verifyMailEntreprise);
router.post("/mail", entrepriseCtr.EmailQuery);

router.post(
  "/",
  entrepriseCtr.entreprise,
  middleware.defaultFunction,
  userCtr.user,
  entrepriseCtr.Email
);
router.post("/updatemail", entrepriseCtr.updateMail);

router.post(
  "/code",
  entrepriseCtr.verifyCode,
  userCtr.userwithId,
  entrepriseCtr.changeEtat,
  userMiddleware.getUserID
);

router.post("/devise", entrepriseCtr.Devise);
router.delete("/devise", entrepriseCtr.DeleDevise);

router.put("/", middleware.isExist, entrepriseCtr.updateEntreprise);

module.exports = router;
