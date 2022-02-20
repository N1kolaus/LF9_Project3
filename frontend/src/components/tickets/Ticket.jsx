import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import classes from "./Ticket.module.css";

const Ticket = (props) => {
    const navigate = useNavigate();
    const date = new Date(props.timestamp);
    const attachments = props.attachments.split(", ");
    const outputDate = `${date.getDate()}.${
        date.getMonth() + 1
    }.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

    const handleOnClick = (props) => {
        navigate(`/tickets/${props.id}`);
    };

    const truncateString = (issue) => {
        return issue.length > 50 ? issue.substring(0, 47) + "..." : issue;
    };

    return (
        <li className={classes.item}>
            <Card>
                <div className={classes.content}>
                    <h3
                        onClick={() => {
                            handleOnClick(props);
                        }}
                    >
                        {props.title}
                    </h3>
                    <section>Bereich: {props.section}</section>
                    <p>Problembeschreibung: {truncateString(props.issue)}</p>
                    <p>Datum: {outputDate}</p>
                    {attachments.length > 1 ? (
                        <p>{attachments.length} Anhänge</p>
                    ) : (
                        <p>1 Anhang</p>
                    )}
                </div>
            </Card>
        </li>
    );
};

export default Ticket;
