import React, {useContext} from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import {adminRoutes, authRoutes, managerRoutes, publicRoutes} from "../utils/routes.js";
import {ADMIN_ROUTE, AUTH_ROUTE, MANAGER_ROUTE, PROFILE_ROUTE} from "../utils/consts.js";
import {Context} from "../main.jsx";
import {observer} from "mobx-react-lite";


const AppRouter = observer(() => {

    const {user} = useContext(Context);

    return (
        <Routes>
            {
                user.isAuthenticated && user.user.role === 3 && authRoutes.map(({path, Component}) => (
                    <Route path={path} element={<Component/>}/>
                ))
            }
            {
                user.isAuthenticated && user.user.role === 1 && adminRoutes.map(({path, Component}) => (
                    <Route path={path} element={<Component/>}/>
                ))
            }
            {
                user.isAuthenticated && user.user.role === 2 && managerRoutes.map(({path, Component}) => (
                    <Route path={path} element={<Component/>}/>
                ))
            }
            {
                !user.isAuthenticated && publicRoutes.map(({path, Component}) => (
                    <Route path={path} element={<Component/>}/>
                ))
            }
            {
                user.isAuthenticated && user.user.role === 3 && <Route path="*" element={<Navigate to={PROFILE_ROUTE}/>} />
            }
            {
                user.isAuthenticated && user.user.role === 1 && <Route path="*" element={<Navigate to={ADMIN_ROUTE}/>} />
            }
            {
                user.isAuthenticated && user.user.role === 2 && <Route path="*" element={<Navigate to={MANAGER_ROUTE}/>} />
            }
            <Route path="*" element={<Navigate to={AUTH_ROUTE}/>} />
        </Routes>
    );
});

export default AppRouter;