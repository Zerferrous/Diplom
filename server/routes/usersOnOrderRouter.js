const Router = require("express");
const router = Router();
const usersOnOrderController = require("../controllers/usersOnOrderController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/getUsersOrdersNotFinished", authMiddleware, usersOnOrderController.getUsersOrdersNotFinished);
router.get("/getUsersOrdersFinished", authMiddleware, usersOnOrderController.getUsersOrdersFinished);
router.post("/addUsersOrder", usersOnOrderController.addUsersOrder)

module.exports = router;