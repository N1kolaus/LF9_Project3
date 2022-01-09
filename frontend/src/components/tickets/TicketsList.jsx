import Ticket from "./Ticket";
import classes from "./TicketsList.module.css";

const TicketsList = (props) => {
    return (
        <ul className={classes.list}>
            {props.tickets.map((ticket) => (
                <Ticket
                    key={ticket.id}
                    id={ticket.id}
                    title={ticket.title}
                    section={ticket.section}
                    issue={ticket.issue}
                />
            ))}
        </ul>
    );
};

export default TicketsList;
