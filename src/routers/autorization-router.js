const router = require("express").Router();
const controller = require("../mongo/controllers/autorization-ctrl");

router.get("/", controller.typeOperations);
router.put("/", controller.typeOperation);

router.post("/user", controller.UpdateUser);
router.post("/user", controller.updateDesignation);

router.delete("/user", controller.deleteOperation);

module.exports = router;
