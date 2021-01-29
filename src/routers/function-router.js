const functionCtr = require("../mongo/controllers/function-controller");
const router = require("express").Router();
const middleware = require("../middleware/function-middleware");

router.get("/", functionCtr.functions);
router.get("/refresh", functionCtr.refrech);
router.post("/", middleware.isExist, functionCtr.function);

router.put("/", middleware.isExist, functionCtr.update);
router.delete("/", middleware.isExist, functionCtr.delete);

module.exports = router;
