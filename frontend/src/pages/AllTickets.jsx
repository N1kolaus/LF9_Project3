import { useState, useEffect } from "react";
import TicketsList from "../components/tickets/TicketsList";
import LoadingSpinner from "../components/helpers/loading-spinner";
import { getAllData } from "../components/helpers/api-calls";

const AllTicketsPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    const currentDomain = window.location.hostname;

    useEffect(() => {
        setIsLoading(true);
        getAllData(currentDomain, setData, setIsLoading);
    }, [currentDomain]);

    if (isLoading) {
        return <LoadingSpinner isLoading={isLoading} />;
    }

    return (
        <section>
            <h1 className="mt-12 px-10">Alle Tickets</h1>
            <TicketsList tickets={data} className="mt-4 px-10" />
        </section>
    );
};

export default AllTicketsPage;
