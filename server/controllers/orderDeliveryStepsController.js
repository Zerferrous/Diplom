const {Notifications, DeliveryPoints, OrderDeliverySteps, Orders} = require("../models/models");
const ApiError = require("../error/ApiError");

class OrderDeliveryStepsController {

    async getOrderNotifications(req, res, next) {
        const  orderId = req.query.orderId;
        if (!orderId) {
            return next(ApiError.badRequest("Не указан ID посылки!"));
        }

        const steps = await Notifications.findAll({
            where: { order: orderId },
            include: [
                {
                    model: Orders,
                    as: 'orderData',
                    include: [
                        {
                            model: OrderDeliverySteps,
                            as: 'order_delivery_steps',
                            include: [
                                {
                                    model: DeliveryPoints,
                                    as: 'point'
                                }
                            ],
                            order: [['step', 'ASC']] // добавьте это
                        }
                    ]
                }
            ]
        });



        const stepsMessages = [];

        steps.forEach((step) => {
            const deliveryStep = step.orderData.order_delivery_steps.find(
                s => s.step === step.step
            );

            stepsMessages.push({
                id: step.id,
                message: step.message.split(',')[0],
                address: deliveryStep?.point?.address || 'Адрес не найден',
                datetime: step.createdAt
            });
        });

        return res.status(200).json(stepsMessages);
    }

}

module.exports = new OrderDeliveryStepsController();