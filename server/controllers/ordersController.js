const {Orders, DeliveryPoints, OrderDeliverySteps, Users, UsersOnOrder} = require("../models/models");
const {buildRoute} = require("../utils/routeBuilder");
const ApiError = require("../error/ApiError");
const sequelize = require("../db");
const {DataTypes, Op} = require("sequelize");
const nodemailer = require('nodemailer');

class OrdersController {

    async createOrder(req, res, next) {
        const { sender, from, to, type, length, width, height, weight, value, passport, cost } = req.body;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 10; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const track_code = result;

        const order = await Orders.create({
            sender: sender,
            track_code: track_code,
            from_delivery_point: from,
            to_delivery_point: to,
            delivery_type: type,
            length: length,
            width: width,
            height: height,
            weight: weight,
            value: value,
            receiver_passport: passport,
            cost: cost
        });
        const from_hub = await DeliveryPoints.findOne({where: {id: from}})
        const to_hub = await DeliveryPoints.findOne({where: {id: to}})
        const hubs = await DeliveryPoints.findAll();
        const route = buildRoute(from_hub, to_hub, hubs, 45)
        const points = [];
        let iterator = 1;
        route.forEach(route => {
            points.push({
            order: order.id,
            step: iterator,
            delivery_point: route.id,})
            iterator += 1;
        });
        OrderDeliverySteps.bulkCreate(points)
        return res.status(200).json({track_code: track_code});
    }

    async getExpectedOrders(req, res, next) {
        const userId = req.query.userId;

        if (!userId) {
            return next(ApiError.badRequest("Не указан ID пользователя!"));
        }

        const point = await DeliveryPoints.findOne({ where: { manager: userId } });

        if (!point) {
            return res.status(200).json([]); // Нет точки — нет заказов
        }

        // 2. Ищем все шаги, где эта точка участвует
        const steps = await OrderDeliverySteps.findAll({
            where: { delivery_point: point.id },
            include: [{ model: Orders, as: 'orderData', include:[{model: Users, as: 'senderData' }] }],
        });

        const expectedOrders = [];

        for (const step of steps) {
            const { step: stepNum, order, orderData, arrived_at } = step;

            if (stepNum === 1 && arrived_at == null) {
                expectedOrders.push(orderData); // Первый шаг — сразу добавляем
            } else if (arrived_at == null) {
                // Получаем предыдущий шаг
                const prevStep = await OrderDeliverySteps.findOne({
                    where: {
                        order: order,
                        step: stepNum - 1
                    }
                });

                if (prevStep?.left_at) {
                    expectedOrders.push(orderData);
                }
            }
        }

        return res.json(expectedOrders);
    }

    async getCurrentOrders(req, res, next) {
        const userId = req.query.userId;

        if (!userId) {
            return next(ApiError.badRequest("Не указан ID пользователя!"));
        }

        const point = await DeliveryPoints.findOne({ where: { manager: userId } });

        if (!point) {
            return res.status(200).json([]); // Нет точки — нет заказов
        }

        // Получаем шаги, где заказ прибыл в точку, но еще не покинул её
        const steps = await OrderDeliverySteps.findAll({
            where: {
                delivery_point: point.id,
                arrived_at: { [Op.not]: null },
                left_at: null,
            },
            include: [{
                model: Orders,
                as: 'orderData',
                include: [{ model: Users, as: 'senderData' }],
            }],
        });

        // Собираем данные по заказам
        const currentOrders = steps.map(step => step.orderData);

        return res.json(currentOrders);
    }

    async setOrderArrived(req, res, next) {
        const userId = req.query.userId;
        const orderId = req.query.orderId;

        if (!userId || !orderId) {
            return next(ApiError.badRequest("Не указаны данные!"));
        }

        const point = await DeliveryPoints.findOne({ where: { manager: userId } });

        if (!point) {
            return next(ApiError.badRequest("Пункт выдачи не найден для данного пользователя!"));
        }

        // Обновление arrived_at
        const [updatedCount] = await OrderDeliverySteps.update(
            { arrived_at: new Date() },
            {
                where: {
                    order: orderId,
                    delivery_point: point.id,
                    arrived_at: null
                }
            }
        );

        if (updatedCount === 0) {
            return res.status(404).json({ message: 'Шаг уже был обновлён или не найден.' });
        }

        // Проверка — это ли последний шаг
        const steps = await OrderDeliverySteps.findAll({
            where: { order: orderId },
            order: [['step', 'DESC']],
        });

        if (!steps.length) return res.status(404).json({ message: 'Шаги доставки не найдены.' });

        const maxStep = steps[0].step;

        const justUpdatedStep = await OrderDeliverySteps.findOne({
            where: {
                order: orderId,
                delivery_point: point.id
            }
        });

        if (justUpdatedStep.step === maxStep) {
            const order = await Orders.findByPk(orderId);

            // Получить всех пользователей, отслеживающих заказ
            const trackingUsers = await UsersOnOrder.findAll({
                where: { order: orderId },
                include: [{ model: Users, as: 'userData' }]
            });

            const emails = trackingUsers
                .map(u => u.userData?.email)
                .filter(email => !!email);

            if (emails.length > 0) {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.mail.ru',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'dubkov.05@mail.ru',
                        pass: 'R9nb8nxphsvfXduBxbXL'
                    }
                });

                for (const email of emails) {
                    await transporter.sendMail({
                        from: '"Служба доставки" <dubkov.05@mail.ru>',
                        to: email,
                        subject: 'Заказ доставлен!',
                        text: `Здравствуйте! Заказ с трек-номером ${order.track_code} прибыл в пункт назначения.`,
                    });
                }
            }
        }

        return res.status(200).json({ updated: updatedCount });
    }

    async setOrderLeft(req, res, next) {
        const userId = req.query.userId;
        const orderId = req.query.orderId;

        if (!userId || !orderId) {
            return next(ApiError.badRequest("Не указаны данные!"));
        }

        const point = await DeliveryPoints.findOne({ where: { manager: userId } });

        if (!point) {
            return next(ApiError.badRequest("Пункт выдачи не найден для данного пользователя!"));
        }

        const update = await OrderDeliverySteps.update(
            {
                left_at: new Date()
            },
            {
                where: {
                    order: orderId,
                    delivery_point: point.id,
                    arrived_at: { [Op.not]: null }, // обязательно уже прибыл
                    left_at: null // но еще не покинул
                }
            }
        );

        return res.status(200).json({ updated: update[0] });
    }

    async getDeliveryTypesStats(req, res, next) {
        const typesWithOrdersCount = await  sequelize.query(`
            SELECT 
                delivery_types.name, 
                COUNT(orders.id) AS orders_count
            FROM 
                delivery_types
            LEFT JOIN 
                orders ON orders.delivery_type = delivery_types.id
            GROUP BY 
                delivery_types.name;
        `, {
            type: sequelize.QueryTypes.SELECT
        });

        return res.json(typesWithOrdersCount);


    }

    async getOrdersStats(req, res, next) {
        const ordersCount = await  sequelize.query(`
            WITH RECURSIVE dates AS (
                SELECT CURDATE() - INTERVAL 9 DAY AS order_date
            UNION ALL
            SELECT order_date + INTERVAL 1 DAY
            FROM dates
            WHERE order_date + INTERVAL 1 DAY <= CURDATE()
                )
            SELECT
                dates.order_date,
                COUNT(orders.id) AS orders_count
            FROM dates
                     LEFT JOIN orders ON DATE(orders.createdAt) = dates.order_date
            GROUP BY dates.order_date
            ORDER BY dates.order_date;
        `, {
            type: sequelize.QueryTypes.SELECT
        });

        return res.json(ordersCount);
    }

}

module.exports = new OrdersController();