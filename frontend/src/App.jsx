import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import NewTicket from "./pages/NewTicket";
import AllTicketsPage from "./pages/AllTickets";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<AllTicketsPage />} />
                    <Route path="new" element={<NewTicket />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
