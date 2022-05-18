import { Link } from "react-router-dom";
import { Fragment, useContext } from "react";
import { handleLogout } from "../components/helpers/api-calls";
import AuthContext from "../components/auth/auth-context";

const MainNavigation = () => {
    const { user, setUser } = useContext(AuthContext);

    const handleLogoutClick = () => {
        handleLogout();
        setUser(null);
    };

    return (
        <nav className="flex items-center justify-between flex-wrap bg-sky-700 p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="font-semibold text-2xl tracking-tight">
                    <Link to="/all">Doubtful-Joy SE</Link>
                </span>
            </div>
            {user && (
                <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                    <div className="text-sm lg:flex-grow">
                        <Link
                            to="/all"
                            className="block mt-4 lg:inline-block lg:mt-0 text-sky-200 hover:text-white mr-4"
                        >
                            Alle Tickets
                        </Link>
                        <Link
                            to="/new"
                            className="block mt-4 lg:inline-block lg:mt-0 text-sky-200 hover:text-white mr-4"
                        >
                            Neues Ticket
                        </Link>
                    </div>

                    <div>
                        <Link
                            to="/"
                            onClick={handleLogoutClick}
                            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-sky-500 hover:bg-white mt-4 lg:mt-0"
                        >
                            Logout
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default MainNavigation;
