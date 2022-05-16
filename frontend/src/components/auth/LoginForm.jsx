import { useRef, useState, useContext } from "react";
import Card from "../ui/Card";
import { handleLogin } from "../helpers/api-calls";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "./auth-context";

const LoginForm = (props) => {
    const { setUser } = useContext(AuthContext);
    const [error, setError] = useState("");
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();
    const navigate = useNavigate();

    const currentDomain = window.location.hostname;

    const handleOnSubmit = async (event) => {
        setError("");
        event.preventDefault();

        const loginData = {
            username: usernameInputRef.current.value,
            password: passwordInputRef.current.value,
        };

        await handleLogin(
            loginData.username,
            loginData.password,
            currentDomain,
            navigate,
            setUser,
            setError
        );
    };

    return (
        <Card>
            <form onSubmit={handleOnSubmit} encType="multipart/form-data">
                <div>
                    <label htmlFor="username">Nutzername</label>
                    <input
                        type="text"
                        required
                        id="username"
                        ref={usernameInputRef}
                    />
                </div>
                <div>
                    <label htmlFor="password">Passwort</label>
                    <input
                        type="password"
                        required
                        id="password"
                        ref={passwordInputRef}
                    />
                </div>
                {error !== "" && <p>Nutzername oder Passwort falsch!</p>}
                <div>
                    <p>
                        Kein registrierter Nutzer?{" "}
                        <Link to={{ pathname: "/signup" }}>Anmelden</Link>
                    </p>
                </div>
                <div>
                    <button>Login</button>
                </div>
            </form>
        </Card>
    );
};

export default LoginForm;
