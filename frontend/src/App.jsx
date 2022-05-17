import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "./layout/Layout";
import NewTicket from "./pages/NewTicket";
import AllTicketsPage from "./pages/AllTickets";
import SingleTicket from "./components/tickets/SingleTicket";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/SignUp";
import ProtectedRoute from "./router/ProtectedRoute";
import AuthContext from "./components/auth/auth-context";

function App() {
    const [user, setUser] = useState(
        JSON.parse(sessionStorage.getItem("auth"))
    );

    return (
        <div className="h-screen bg-gradient-to-b from-gray-200 to-gray-400">
            <AuthContext.Provider value={{ user, setUser }}>
                <BrowserRouter>
                    <ToastContainer theme={"dark"} />
                    <Layout user={user} setUser={setUser}>
                        <Routes>
                            <Route
                                path="/"
                                exact={true}
                                element={<LoginPage />}
                            />
                            <Route
                                path="/login"
                                exact={true}
                                element={<LoginPage />}
                            />
                            <Route
                                path="/signUp"
                                exact={true}
                                element={<SignUpPage />}
                            />
                            <Route
                                element={
                                    <ProtectedRoute
                                        user={user}
                                        setUser={setUser}
                                    />
                                }
                            >
                                <Route
                                    path="/all"
                                    element={<AllTicketsPage />}
                                />
                                <Route path="new" element={<NewTicket />} />
                                <Route
                                    path="/tickets/:id"
                                    element={<SingleTicket />}
                                />
                            </Route>
                        </Routes>
                    </Layout>
                </BrowserRouter>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
