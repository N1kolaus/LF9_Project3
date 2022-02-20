import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import NewTicketForm from "../components/tickets/NewTicketForm";

const NewTicket = () => {
    const navigate = useNavigate();

    const currentDomain = window.location.hostname;

    const handleNewTicket = (ticketData) => {
        axios
            .post(`http://${currentDomain}:8000/api/postIssue`, ticketData)
            .then((response) => {
                toast.success("Daten erfolgreich gespeichert. 😊");
                navigate("/");
            })
            .catch((err) => {
                toast.error("Daten konnten nicht gesendet werden. 😞");
            });
    };

    return (
        <section>
            <h1>Neues Ticket</h1>
            <NewTicketForm onNewTicket={handleNewTicket} />
        </section>
    );
};

export default NewTicket;
