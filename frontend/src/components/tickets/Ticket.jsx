import Card from "../ui/Card";
import classes from "./Ticket.module.css";

const Ticket = (props) => {
    console.log(props);
    return (
        <li className={classes.item}>
            <Card>
                <div className={classes.content}>
                    <h3>{props.title}</h3>
                    <section>Bereich: {props.section}</section>
                    <p>Problembeschreibung: {props.issue}</p>
                    <p>Timestamp: {props.timestamp}</p>
                    <p>Anhänge: {props.attachments}</p>
                </div>
            </Card>
        </li>
    );
};

export default Ticket;
