import {$authHost} from "./index.js";

export const getUsersNewNotifications = async (userId) => {
    const {data} = await $authHost.get(`/api/userNotifications/getUsersNewNotifications?userId=${userId}`);
    return data;
}

export const readNotification = async (notificationId) => {
    const {data} = await $authHost.put(`/api/userNotifications/readNotification?notificationId=${notificationId}`);
    return data;
}