import {$host} from "./index.js";
import { jwtDecode } from "jwt-decode"
import {$authHost} from "./index.js";

export const registartion = async (email, password, name, surname, patronymic, passport) => {
    const {data} = await $host.post("api/users/register", {email, password, name, surname, patronymic, passport});
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token);
}

export const login = async (email, password) => {
    const {data} = await $host.post("api/users/login", {email, password});
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token);
}

export const check = async () => {
    const {data} = await $authHost.get("api/users/check");
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token);
}

export const getUsersRolesStats = async () => {
    const {data} = await $authHost.get("api/users/getUsersRolesStats");
    return data;
}