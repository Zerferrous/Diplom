const Router = require("express");
const router = Router();
const ordersController = require("../controllers/ordersController");

router.post("/createOrder", ordersController.createOrder);
router.get("/getExpectedOrders", ordersController.getExpectedOrders);
router.get("/getCurrentOrders", ordersController.getCurrentOrders);
router.put("/setOrderArrived", ordersController.setOrderArrived);
router.put("/setOrderLeft", ordersController.setOrderLeft);
router.get("/getDeliveryTypesStats", ordersController.getDeliveryTypesStats);
router.get("/getOrdersStats", ordersController.getOrdersStats);

module.exports = router;