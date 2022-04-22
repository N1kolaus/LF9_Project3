import { Link } from "react-router-dom";
import { Fragment, useContext } from "react";
import { handleLogout } from "../components/helpers/api-calls";
import AuthContext from "../components/auth/auth-context";
import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
    const { user, setUser } = useContext(AuthContext);

    const handleLogoutClick = () => {
        handleLogout();
        setUser(null);
    };

    return (
        <header className={classes.header}>
            <Link to="/all">
                <div className={classes.logo}>Doubtful-Joy SE</div>
            </Link>

            <nav>
                <ul>
                    {user ? (
                        <Fragment>
                            <li>
                                <Link to="/all">Alle Tickets</Link>
                            </li>
                            <li>
                                <Link to="/new">Neues Ticket erstellen</Link>
                            </li>
                            <li>
                                <Link onClick={handleLogoutClick} to="/login">
                                    Logout {user.username}
                                </Link>
                            </li>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                        </Fragment>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default MainNavigation;
