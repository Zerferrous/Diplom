const Router = require("express");
const router = Router();
const orderDeliveryStepsController = require("../controllers/orderDeliveryStepsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/getOrderNotifications", authMiddleware, orderDeliveryStepsController.getOrderNotifications);

module.exports = router;