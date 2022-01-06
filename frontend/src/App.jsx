import { Link } from "react-router-dom";

function App() {
    return (
        <div>
            <h1>Tickets</h1>
            <nav
                style={{
                    borderBottom: "solid 1px",
                    paddingBottom: "1rem",
                }}
            >
                <Link to="/new">New Ticket</Link>
            </nav>
        </div>
    );
}

export default App;
