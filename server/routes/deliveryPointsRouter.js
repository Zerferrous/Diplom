const Router = require("express");
const router = Router();
const deliveryPointsController = require("../controllers/deliveryPointsController");
router.get("/getAll", deliveryPointsController.getAll);
router.get("/getAllOrdersDeliveryPoints", deliveryPointsController.getAllOrdersDeliveryPoints);
router.get("/getOrdersRoutes", deliveryPointsController.getOrdersRoutes);
router.get("/getDeliveryPointsStats", deliveryPointsController.getDeliveryPointsStats)


module.exports = router;