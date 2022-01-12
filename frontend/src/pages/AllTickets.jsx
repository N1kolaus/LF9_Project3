import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TicketsList from "../components/tickets/TicketsList";

const AllTicketsPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    const currentDomain = window.location.hostname;

    useEffect(() => {
        setIsLoading(true);
        axios
            .get(`http://${currentDomain}:8000/api/allData`)
            .then((response) => {
                setData(response.data.Issues);
                setIsLoading(false);
            })
            .catch((err) => {
                toast.error("Daten konnten nicht abgerufen werden. 😞");
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <section>
                <p>Loading...</p>
            </section>
        );
    }

    return (
        <section>
            <h1>Alle Tickets</h1>
            <TicketsList tickets={data} />
        </section>
    );
};

export default AllTicketsPage;
