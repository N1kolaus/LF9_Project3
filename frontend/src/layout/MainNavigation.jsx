import { Link } from "react-router-dom";
import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
    return (
        <header className={classes.header}>
            <Link to="/">
                <div className={classes.logo}>Doubtful-Joy SE</div>
            </Link>

            <nav>
                <ul>
                    <li>
                        <Link to="/">Alle Tickets</Link>
                    </li>
                    <li>
                        <Link to="/new">Neues Ticket erstellen</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default MainNavigation;
