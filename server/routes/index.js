const Router = require("express");
const router = Router();

const usersRouter = require("./usersRouter");
const ordersRouter = require("./ordersRouter");
const deliveryPointsRouter = require("./deliveryPointsRouter");
const deliveryTypesRouter = require("./deliveryTypesRouter");
const orderDeliveryStepsRouter = require("./orderDeliveryStepsRouter");
const userNotificationsRouter = require("./userNotificationsRouter");
const usersOnOrderRouter = require("./usersOnOrderRouter");

router.use('/users', usersRouter)
router.use('/orders', ordersRouter)
router.use('/deliveryPoints', deliveryPointsRouter)
router.use('/deliveryTypes', deliveryTypesRouter)
router.use('/orderDeliverySteps', orderDeliveryStepsRouter)
router.use('/userNotifications', userNotificationsRouter)
router.use('/usersOnOrder', usersOnOrderRouter)

module.exports = router;