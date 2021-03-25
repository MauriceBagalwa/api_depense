const userController = require("../mongo/controllers/user-controller");
const router = require("express").Router();
const middleware = require("../middleware/user-middleware");

router.get("/", userController.users);

router.post(
  "/",
  middleware.userExist,
  userController.user,
  userController.Usermail,
  middleware.getUser
);
router.post("/signin", userController.signin, middleware.getUserID);

router.put("/", middleware.userExist, userController.upadte);
router.put("/psswd", middleware.comparePsswd);
router.put("/config", userController.updateCount, middleware.getUser);

router.delete("/", userController.delte);

module.exports = router;
