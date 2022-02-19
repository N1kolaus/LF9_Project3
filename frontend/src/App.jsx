import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Layout from "./layout/Layout";
import NewTicket from "./pages/NewTicket";
import AllTicketsPage from "./pages/AllTickets";
import SingleTicket from "./components/tickets/SingleTicket";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <BrowserRouter>
            <ToastContainer theme={"dark"} />
            <Layout>
                <Routes>
                    <Route path="/" element={<AllTicketsPage />} />
                    <Route path="new" element={<NewTicket />} />
                    <Route path="/tickets/:id" element={<SingleTicket />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
