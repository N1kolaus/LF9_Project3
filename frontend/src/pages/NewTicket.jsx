import { useNavigate } from "react-router-dom";
import NewTicketForm from "../components/tickets/NewTicketForm";
import { postIssue } from "../components/helpers/api-calls";

const NewTicket = () => {
    const navigate = useNavigate();

    const currentDomain = window.location.hostname;

    const handleNewTicket = async (ticketData) => {
        await postIssue(currentDomain, ticketData, navigate);
    };

    return (
        <section>
            <h1>Neues Ticket</h1>
            <NewTicketForm onNewTicket={handleNewTicket} />
        </section>
    );
};

export default NewTicket;
