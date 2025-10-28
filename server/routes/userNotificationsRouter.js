const Router = require("express");
const router = Router();
const userNotificationsController = require("../controllers/userNotificationsController");

router.get("/getUsersNewNotifications", userNotificationsController.getUsersNewNotifications)
router.put("/readNotification", userNotificationsController.readNotification)

module.exports = router;