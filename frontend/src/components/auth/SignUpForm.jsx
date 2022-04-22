import { useRef, useState } from "react";
import Card from "../ui/Card";
import classes from "./LoginForm.module.css";
import { handleSignUp } from "../helpers/api-calls";
import { Link, useNavigate } from "react-router-dom";

const SignUpForm = (props) => {
    const [error, setError] = useState("");
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();
    const emailInputRef = useRef();
    const navigate = useNavigate();

    const currentDomain = window.location.hostname;

    const handleOnSubmit = async (event) => {
        setError("");
        event.preventDefault();

        const signUpData = {
            username: usernameInputRef.current.value,
            email: emailInputRef.current.value,
            password: passwordInputRef.current.value,
        };

        await handleSignUp(
            signUpData.username,
            signUpData.email,
            signUpData.password,
            currentDomain,
            navigate,
            setError
        );
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
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        required
                        id="email"
                        ref={emailInputRef}
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
                        Nutzername, Email und Passwort sind Pflichtfelder!
                    </p>
                )}
                <div>
                    <p>
                        Bereits registrierter Nutzer?{" "}
                        <Link to={{ pathname: "/login" }}>Anmelden</Link>
                    </p>
                </div>
                <div className={classes.actions}>
                    <button>SignUp</button>
                </div>
            </form>
        </Card>
    );
};

export default SignUpForm;
