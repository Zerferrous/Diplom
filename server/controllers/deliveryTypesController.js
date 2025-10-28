const {DeliveryTypes} = require('../models/models');

class DeliveryTypesController {

    async getAll(req, res) {
        const deliveryTypes = await DeliveryTypes.findAll();
        return res.json(deliveryTypes);
    }

}

module.exports = new DeliveryTypesController();