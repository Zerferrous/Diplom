const ApiError = require("../error/ApiError");
const {UserNotifications, Orders, Notifications} = require("../models/models");

class UserNotificationsController {

    async getUsersNewNotifications(req, res, next) {
        const userId = req.query.userId;

        if (!userId) {
            return next(ApiError.badRequest("Не указан ID пользователя!"));
        }

        const notifications = await UserNotifications.findAll({
            where: {
                user: userId,
                is_read: false
            },
            include: [
                {
                    model: Notifications,
                    as: "notificationData",
                }
            ]
        });
        return res.json(notifications);
    }

    async readNotification(req, res, next) {
        const notificationId = req.query.notificationId;

        if (!notificationId) {
            return next(ApiError.badRequest("Не указан ID уведомления!"));
        }

        const [updatedRowsCount] = await UserNotifications.update(
            { is_read: true },
            { where: { id: notificationId } }
        );

        if (updatedRowsCount === 0) {
            return next(ApiError.badRequest("Уведомление не найдено или уже прочитано"));
        }

        return res.json({ message: "Уведомление помечено как прочитанное" });
    }

}

module.exports = new UserNotificationsController();