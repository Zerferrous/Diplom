import Auth from "../pages/Auth.jsx";
import Calculator from "../pages/Calculator.jsx";
import {
    ADMIN_ROUTE,
    AUTH_ROUTE,
    CALCULATOR_ROUTE,
    CREATE_ORDER_ROUTE,
    MANAGER_ROUTE,
    PROFILE_ROUTE,
    REG_ROUTE
} from "./consts.js";
import Admin from "../pages/Admin.jsx";
import Profile from "../pages/Profile.jsx";
import Reg from "../pages/Reg.jsx";
import CreateOrder from "../pages/CreateOrder.jsx";
import Manager from "../pages/Manager.jsx";
export const publicRoutes = [
    {
        path: AUTH_ROUTE,
        Component: Auth
    },
    {
      path: REG_ROUTE,
      Component: Reg
    },
    {
        path: CALCULATOR_ROUTE,
        Component: Calculator
    }
]

export const authRoutes = [
    {
        path: PROFILE_ROUTE,
        Component: Profile
    },
    {
        path: CREATE_ORDER_ROUTE,
        Component: CreateOrder
    },
    {
        path: CALCULATOR_ROUTE,
        Component: Calculator
    }
]

export const managerRoutes = [
    {
        path: MANAGER_ROUTE,
        Component: Manager
    },
    {
        path: CALCULATOR_ROUTE,
        Component: Calculator
    }
]

export const adminRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: CALCULATOR_ROUTE,
        Component: Calculator
    }
]