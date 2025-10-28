const { DeliveryPoints, OrderDeliverySteps} = require("../models/models");
const ApiError = require("../error/ApiError");
const {Op, Sequelize} = require("sequelize");

class DeliveryPointsController {

    async getAll(req, res) {
        const deliveryPoints = await DeliveryPoints.findAll();
        return res.json(deliveryPoints);
    }

    async getAllOrdersDeliveryPoints(req, res, next) {
        const orderId = req.query.orderId;
        if (!orderId) {
            return next(ApiError.badRequest("Не указан ID заказа"));
        }
        const deliveryPoints = await OrderDeliverySteps.findAll(
            {
                where: {
                    order: orderId,
                },
                include: [
                    {
                        model: DeliveryPoints,
                        as: "point",
                    }
                ]
            }
        );
        const pointsArray = deliveryPoints.map(deliveryPoint => deliveryPoint.point);
        return res.json(pointsArray);
    }

    async getOrdersRoutes(req, res, next) {
        const orderId = req.query.orderId;
        if (!orderId) {
            return next(ApiError.badRequest("Не указан ID заказа"));
        }
        const finishedRoute = await OrderDeliverySteps.findAll({
            where: {
                order: orderId,
                arrived_at: {
                    [Op.ne]: null // Только шаги с непустым arrived_at
                }
            },
            include: [
                {
                    model: DeliveryPoints,
                    as: "point",
                }
            ],
            order: [['step', 'ASC']] // Сортировка по step по возрастанию
        });
        const finishedRoutePoints = finishedRoute.map(deliveryPoint => deliveryPoint.point);

        const allSteps = await OrderDeliverySteps.findAll({
            where: { order: orderId },
            include: [
                { model: DeliveryPoints, as: 'point' }
            ],
            order: [['step', 'ASC']]
        });

        const futureRoute = allSteps.filter((step, index, array) => {
            const nextStep = array[index + 1];

            return (
                step.arrived_at === null ||
                (step.arrived_at !== null && step.left_at === null) ||
                (
                    step.arrived_at !== null &&
                    step.left_at !== null &&
                    nextStep && nextStep.arrived_at === null
                )
            );
        });
        const futureRoutePoints = futureRoute.map(deliveryPoint => deliveryPoint.point);

        return res.json({finishedRoutePoints, futureRoutePoints});
    }

    async getDeliveryPointsStats(req, res, next) {
        try {
            const stats = await OrderDeliverySteps.findAll({
                attributes: [
                    [Sequelize.col('point.address'), 'address'],
                    [
                        // Средняя разница в минутах между left_at и arrived_at
                        Sequelize.fn(
                            'AVG',
                            Sequelize.literal(`TIMESTAMPDIFF(MINUTE, arrived_at, left_at)`)
                        ),
                        'avgTime'
                    ]
                ],
                include: [{
                    model: DeliveryPoints,
                    as: 'point',
                    attributes: []
                }],
                where: {
                    arrived_at: { [Sequelize.Op.ne]: null },
                    left_at: { [Sequelize.Op.ne]: null }
                },
                group: ['point.address'],
                order: [[Sequelize.col('point.address'), 'ASC']],
                raw: true
            });

            const result = stats.map(({ address, avgTime }) => ({
                address,
                avgTime: parseFloat(avgTime)
            }));

            return res.json(result);
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new DeliveryPointsController();