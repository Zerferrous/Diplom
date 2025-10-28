const Router = require("express");
const router = Router();
const deliveryTypesController = require("../controllers/deliveryTypesController");

router.get("/getAll", deliveryTypesController.getAll);

module.exports = router;