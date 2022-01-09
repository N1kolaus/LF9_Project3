import { useNavigate } from "react-router-dom";
import NewTicketForm from "../components/tickets/NewTicketForm";

const NewTicket = () => {
    const navigate = useNavigate();

    const handleNewTicket = (ticketData) => {
        console.log(ticketData);
    };

    return (
        <section>
            <h1>Neues Ticket</h1>
            <NewTicketForm onNewTicket={handleNewTicket} />
        </section>
    );
};

export default NewTicket;
