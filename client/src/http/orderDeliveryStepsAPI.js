import {$authHost} from "./index.js";

export const getOrderDeliveryStepsMessages = async (orderId) => {
    const {data} = await $authHost.get(`api/orderDeliverySteps/getOrderNotifications?orderId=${orderId}`);
    return data;
}