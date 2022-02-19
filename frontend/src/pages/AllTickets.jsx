import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TicketsList from "../components/tickets/TicketsList";
import LoadingSpinner from "../components/helpers/loading-spinner";

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
    }, [currentDomain]);

    if (isLoading) {
        return <LoadingSpinner isLoading={isLoading} />;
    }

    return (
        <section>
            <h1>Alle Tickets</h1>
            <TicketsList tickets={data} />
        </section>
    );
};

export default AllTicketsPage;
