import Card from "../ui/Card";
import classes from "./Ticket.module.css";

const Ticket = (props) => {
    return (
        <li className={classes.item}>
            <Card>
                <div className={classes.content}>
                    <h3>{props.title}</h3>
                    <section>{props.section}</section>
                    <p>{props.issue}</p>
                </div>
            </Card>
        </li>
    );
};

export default Ticket;
