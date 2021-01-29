const userController = require("../mongo/controllers/user-controller");
const router = require("express").Router();
const middleware = require("../middleware/user-middleware");

router.get("/", userController.users);

router.post("/", middleware.userExist, userController.user, middleware.getUser);

router.put("/", userController.upadte);
router.put("/config", userController.updateCount, middleware.getUser);

router.delete("/", userController.delte);

module.exports = router;
