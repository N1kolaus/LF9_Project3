import "./index.css";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import NewTicket from "./routes/new";

const rootElement = document.getElementById("root");
render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="new" element={<NewTicket />} />
        </Routes>
    </BrowserRouter>,
    rootElement
);
