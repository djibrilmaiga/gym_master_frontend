import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthService from "../services/AuthService";

const PrivateRoute = ({ roles }) => {
    const currentUser = AuthService.getCurrentUser();
    if(!currentUser) {
        return <Navigate to={"/"} />;
    }
    const userRole = currentUser.role;
    if(roles && !roles.includes(userRole)) {
        return <Navigate to="/unauthorized" />
    }
    return <Outlet />;
};

export default PrivateRoute;