import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import NewTicketForm from "../components/tickets/NewTicketForm";
import { APIURL } from "../components/services/urls";

const NewTicket = () => {
    const navigate = useNavigate();

    const handleNewTicket = (ticketData) => {
        console.log(ticketData);
        axios
            .post(`${APIURL}/post`, ticketData)
            .then((response) => {
                console.log(response);
                toast.success("Daten erfolgreich gespeichert. 😊");
                navigate("/");
            })
            .catch((err) => {
                console.log(err);
                toast.error("Daten konnten nicht gesendet werden. 😞");
            });
        // fetch(`${APIURL}/post`, {
        //     method: "POST",
        //     body: JSON.stringify(ticketData),
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        // }).then(() => {
        //     toast.success("Daten erfolgreich gespeichert. 😊");
        //     navigate("/");
        // });
    };

    return (
        <section>
            <h1>Neues Ticket</h1>
            <NewTicketForm onNewTicket={handleNewTicket} />
        </section>
    );
};

export default NewTicket;
