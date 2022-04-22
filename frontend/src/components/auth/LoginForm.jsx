import { useRef, useState, useContext } from "react";
import Card from "../ui/Card";
import classes from "./LoginForm.module.css";
import { handleLogin } from "../helpers/api-calls";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "./auth-context";

const LoginForm = (props) => {
    const { user, setUser } = useContext(AuthContext);
    const [error, setError] = useState("");
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();
    const router = useNavigate();

    const currentDomain = window.location.hostname;

    const handleOnSubmit = async (event) => {
        setError("");
        event.preventDefault();

        const loginData = {
            username: usernameInputRef.current.value,
            password: passwordInputRef.current.value,
        };

        const login = await handleLogin(
            loginData.username,
            loginData.password,
            currentDomain
        );

        if ("user" in login) {
            setUser(login.user);
            router("/all");
        } else {
            setError(login);
            console.log(login);
        }
    };

    return (
        <Card>
            <form
                className={classes.form}
                onSubmit={handleOnSubmit}
                encType="multipart/form-data"
            >
                <div className={classes.control}>
                    <label htmlFor="username">Nutzername</label>
                    <input
                        type="text"
                        required
                        id="username"
                        ref={usernameInputRef}
                    />
                </div>
                <div className={classes.control}>
                    <label htmlFor="password">Passwort</label>
                    <input
                        type="password"
                        required
                        id="password"
                        ref={passwordInputRef}
                    />
                </div>
                {error !== "" && (
                    <p className={classes.error}>
                        Nutzername oder Passwort falsch!
                    </p>
                )}
                <div>
                    <p>
                        Kein registrierter Nutzer?{" "}
                        <Link to={{ pathname: "/signup" }}>Anmelden</Link>
                    </p>
                </div>
                <div className={classes.actions}>
                    <button>Login</button>
                </div>
            </form>
        </Card>
    );
};

export default LoginForm;
