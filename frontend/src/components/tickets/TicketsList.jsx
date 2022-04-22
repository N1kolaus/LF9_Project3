import Ticket from "./Ticket";
import classes from "./TicketsList.module.css";

const TicketsList = (props) => {
    console.log(props);

    if (props.tickets.length > 0) {
        return (
            <ul className={classes.list}>
                {props.tickets.map((ticket) => {
                    return (
                        <Ticket
                            key={ticket.id}
                            status={ticket.solved}
                            id={ticket.id}
                            title={ticket.title}
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
