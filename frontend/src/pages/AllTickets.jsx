import { useState, useEffect } from "react";
import TicketsList from "../components/tickets/TicketsList";

const AllTicketsPage = () => {
    const [data, setData] = useState([]);

    return (
        <section>
            <h1>Alle Tickets</h1>
            <TicketsList tickets={data} />
        </section>
    );
};

export default AllTicketsPage;
