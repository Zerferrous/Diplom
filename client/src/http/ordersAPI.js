import {$authHost} from "./index.js";
export const getUsersOrdersNotFinished = async (userId) => {
    const {data} = await $authHost.get(`api/usersOnOrder/getUsersOrdersNotFinished?userId=${userId}`);
    return data;
}

export const getUsersOrdersFinished = async (userId) => {
    const {data} = await $authHost.get(`api/usersOnOrder/getUsersOrdersFinished?userId=${userId}`);
    return data;
}

export const addUserToOrder = async (userId, trackCode) => {
    const {data} = await $authHost.post(`api/usersOnOrder/addUsersOrder?userId=${userId}&trackCode=${trackCode}`);
    return data;
}

export const createOrder = async (sender, from, to, length, width, height, weight, value, type, passport, cost) => {
    const {data} = await $authHost.post(`api/orders/createOrder`, {sender, from, to, length, width, height, weight, value, type, passport, cost});
    return data;
}

export const getExpectedOrders = async (userId) => {
    const {data} = await $authHost.get(`api/orders/getExpectedOrders?userId=${userId}`);
    return data;
}


export const setOrderArrived = async (userId, orderId) => {
    const {data} = await $authHost.put(`api/orders/setOrderArrived?userId=${userId}&orderId=${orderId}`);
    return data;
}

export const getCurrentOrders = async (userId) => {
    const {data} = await $authHost.get(`api/orders/getCurrentOrders?userId=${userId}`);
    return data;
}


export const setOrderLeft = async (userId, orderId) => {
    const {data} = await $authHost.put(`api/orders/setOrderLeft?userId=${userId}&orderId=${orderId}`);
    return data;
}

export const getDeliveryTypesStats = async () => {
    const {data} = await $authHost.get(`api/orders/getDeliveryTypesStats`);
    return data;
}

export const getOrdersStats = async () => {
    const {data} = await $authHost.get(`api/orders/getOrdersStats`);
    return data;
}