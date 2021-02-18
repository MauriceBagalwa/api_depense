const router = require("express").Router();
const controller = require("../mongo/controllers/operation");
const middleware = require("../middleware/operation");

router.get("/", controller.Operations);
router.post(
  "/",
  middleware.isExist,
  controller.Operation,
  middleware.operations
);

router.put("/", middleware.isExist, controller.update, middleware.operations);
router.put("/user", controller.UpdateUser, middleware.operations);

// router.post("/user", controller.updateDesignation);

router.delete("/", controller.deleteOperation);

module.exports = router;
