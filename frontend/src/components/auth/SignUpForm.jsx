import { useRef, useState, useContext } from "react";
import Card from "../ui/Card";
import classes from "./LoginForm.module.css";
import { handleSignUp } from "../helpers/api-calls";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUpForm = (props) => {
    const [error, setError] = useState("");
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();
    const emailInputRef = useRef();
    const router = useNavigate();

    const currentDomain = window.location.hostname;

    const handleOnSubmit = async (event) => {
        setError("");
        event.preventDefault();

        const signUpData = {
            username: usernameInputRef.current.value,
            email: emailInputRef.current.value,
            password: passwordInputRef.current.value,
        };

        const signUp = await handleSignUp(
            signUpData.username,
            signUpData.email,
            signUpData.password,
            currentDomain
        );

        if (signUp) {
            console.log(signUp);
            toast.success("Nutzer wurde angelegt. Ab zum Login! 😊");
            router("/login");
        } else {
            toast.error("Nutzer konnte nicht angelegt werden. 😞");
            setError(signUp);
            console.log(signUp);
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
