import { useState, useEffect, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../components/auth/auth-context";

const ProtectedRoute = ({ redirectPath = "/", children }) => {
    const { user, setUser } = useContext(AuthContext);

    if (!user) {
        return <Navigate to={redirectPath} replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
