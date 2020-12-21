const { Router } = require("express");
const userController = require("../mongo/controllers/user-controller");
const router = require("express").Router();

router.get("/", userController.users);
router.post("/", userController.user);

module.exports = router;
