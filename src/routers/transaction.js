const router = require("express").Router();
const controller = require("../mongo/controllers/transaction");

router.get("/", controller.transactions);
router.get("/dash", controller.DashData);
router.get("/id", controller.findTransaction);
router.get("/notif", controller.Notification);
router.post("/", controller.transaction);
router.post("/valid", controller.valideTransaction, controller.Notification);

module.exports = router;
