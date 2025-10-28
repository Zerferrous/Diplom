import {$host} from './index.js'

export const getAll = async () => {
    const {data} = await $host.get('api/deliveryPoints/getAll');
    return data;
}

export const getAllOrdersDeliveryPoints = async (orderId) => {
    const {data} = await $host.get(`api/deliveryPoints/getAllOrdersDeliveryPoints?orderId=${orderId}`);
    return data;
}

export const getOrdersRoutes = async (orderId) => {
    const {data} = await $host.get(`api/deliveryPoints/getOrdersRoutes?orderId=${orderId}`);
    return data;
}

export const getDeliveryPointsStats = async () => {
    const {data} = await $host.get(`api/deliveryPoints/getDeliveryPointsStats`);
    return data;
}