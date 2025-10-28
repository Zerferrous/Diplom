import {makeAutoObservable} from "mobx";

export default class UserStore {
    constructor() {
        this._isAuthenticated = false;
        this._user = {};
        makeAutoObservable(this);
    }

    setIsAuthenticated(bool) {
        this._isAuthenticated = bool;
    }

    setUser(user) {
        this._user = user;
    }

    get isAuthenticated() {
        return this._isAuthenticated;
    }

    get user() {
        return this._user;
    }
}