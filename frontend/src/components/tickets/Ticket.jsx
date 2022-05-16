import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";

const Ticket = (props) => {
    const navigate = useNavigate();
    const date = new Date(props.timestamp);
    const attachments = props.attachments.split(", ");
    const outputDate = `${date.getDate()}.${
        date.getMonth() + 1
    }.${date.getFullYear()} ${date.getHours()}:${
        (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()
    }`;

    const handleOnClick = (props) => {
        navigate(`/tickets/${props.id}`);
    };

    return (
        <li>
            <Card>
                <div>
                    <h2
                        onClick={() => {
                            handleOnClick(props);
                        }}
                    >
                        {props.title}
                    </h2>
                    <section>
                        <b>
                            Status: {props.status ? "Abgeschlossen" : "Offen"}
                        </b>
                    </section>
                    <p>Bereich: {props.section}</p>
                    <p>Datum: {outputDate}</p>
                    {attachments.length > 1 ? (
                        <p>{attachments.length} Anhänge</p>
                    ) : attachments[0] !== "no attachments" ? (
                        <p>1 Anhang</p>
                    ) : (
                        <p>Keine Anhänge</p>
                    )}
                </div>
            </Card>
        </li>
    );
};

export default Ticket;
