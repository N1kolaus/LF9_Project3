import { useEffect, useContext } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../components/auth/auth-context";

const ProtectedRoute = ({ redirectPath = "/", children }) => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = sessionStorage.getItem("auth");

        if (!auth) {
            setUser(null);
            navigate("/");
        }

        setUser(JSON.parse(auth));
    }, [navigate, setUser]);

    if (!user) {
        return <Navigate to={redirectPath} replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
