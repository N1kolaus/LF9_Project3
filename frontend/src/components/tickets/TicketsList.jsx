import { useContext } from "react";
import Ticket from "./Ticket";
import AuthContext from "../auth/auth-context";
import classes from "./TicketsList.module.css";
import { useNavigate } from "react-router-dom";

const TicketsList = (props) => {
    const { user } = useContext(AuthContext);
    let { tickets } = props;
    tickets = tickets.reverse();
    const navigate = useNavigate();

    if (!user) {
        navigate("/");
    }

    if (tickets.length > 0) {
        return (
            <ul className={classes.list}>
                {tickets.map((ticket) => {
                    return (
                        <Ticket
                            key={ticket.id}
                            status={ticket.solved}
                            id={ticket.id}
                            title={ticket.title}
                            username={ticket.username}
                            section={ticket.section}
                            timestamp={ticket.timestamp}
                            attachments={ticket.attachments}
                        />
                    );
                })}
            </ul>
        );
    }

    return <p>Keine Tickets verfügbar.</p>;
};

export default TicketsList;
