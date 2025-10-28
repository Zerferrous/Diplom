const {UsersOnOrder, Orders, OrderDeliverySteps} = require("../models/models");
const ApiError = require("../error/ApiError");
const sequelize = require("../db");
const {Op} = require("sequelize");

class UsersOnOrderController {

    async getUsersOrdersNotFinished(req, res, next) {
        const userId = req.query.userId;
        if (!userId) {
            return next(ApiError.badRequest("Не указан ID пользователя!"));
        }
        const orders = await UsersOnOrder.findAll({
            where: { user: userId },
            include: [
                {
                    model: Orders,
                    as: "orderData",
                    required: true,
                    include: [
                        {
                            model: OrderDeliverySteps,
                            as: "order_delivery_steps",
                            required: true,
                            where: {
                                step: sequelize.literal(`(
                            SELECT MAX(ods2.step)
                            FROM order_delivery_steps AS ods2
                            WHERE ods2.order = orderData.id
                        )`),
                                left_at: null
                            }
                        }
                    ]
                }
            ],
            order: [[{ model: Orders, as: 'orderData' }, 'id', 'DESC']]
        });

        const ordersData = orders.map(order => order.orderData);

        return res.json(ordersData);
    }

    async getUsersOrdersFinished(req, res, next) {
        const userId = req.query.userId;
        if (!userId) {
            return next(ApiError.badRequest("Не указан ID пользователя!"));
        }
        const orders = await sequelize.query(`
    SELECT o.*
    FROM users_on_order uoo
    JOIN orders o ON o.id = uoo.order
    WHERE uoo.user = :userId
      AND EXISTS (
          SELECT 1
          FROM order_delivery_steps ods
          WHERE ods.order = o.id
            AND ods.left_at IS NOT NULL
            AND ods.step = (
                SELECT MAX(ods2.step)
                FROM order_delivery_steps ods2
                WHERE ods2.order = o.id
            )
      )
    ORDER BY o.id DESC
`, {
            replacements: { userId },
            type: sequelize.QueryTypes.SELECT
        });

        return res.json(orders);
    }

    async addUsersOrder(req, res, next) {
        const userId = req.query.userId;
        const trackCode = req.query.trackCode;
        if (!userId || !trackCode) {
            return next(ApiError.badRequest("Не указаны данные!"));
        }

        const order = await Orders.findOne({
            where: {track_code: trackCode},
        })

        if (!order) {
            return next(ApiError.badRequest("Посылка не найдена!"));
        }

        const userOnOrder = await UsersOnOrder.findOne(
            {where: {user: userId, order: order.id}}
        )

        if (userOnOrder) {
            return next(ApiError.badRequest("Вы уже отслеживаете эту посылку!"));
        }

        const created = await UsersOnOrder.create({
            user: userId,
            order: order.id,
        })

        return res.json(created);
    }

}

module.exports = new UsersOnOrderController();