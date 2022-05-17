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
        <div className="mt-8 flex justify-center items-center flex-wrap">
            <form onSubmit={handleOnSubmit} encType="multipart/form-data">
                <div className="flex justify-center text-3xl font-bold text-gray-900 uppercase">
                    Login
                </div>
                <p className="mt-4 text-gray-900">Bitten melden Sie sich an:</p>
                <div className="mt-2 text-gray-900">
                    <input
                        type="text"
                        required
                        id="username"
                        ref={usernameInputRef}
                        placeholder="Benutzer"
                        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                </div>
                <div className="mt-4 text-gray-900">
                    <input
                        type="password"
                        required
                        id="password"
                        ref={passwordInputRef}
                        placeholder="Passwort"
                        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                </div>
                {error !== "" && (
                    <p className="text-red-600">
                        Nutzername oder Passwort falsch!
                    </p>
                )}
                <div className="mt-4">
                    <button className="inline-block px-4 py-1 rounded bg-sky-600 text-white shadow-lg uppercase tracking-wider font-semibold hover:bg-sky-900 hover:shadow-lg w-full">
                        Login
                    </button>
                </div>
                <div className="flex items-center justify-between mt-4 text-gray-700">
                    <p className="mb-0 mr-2">Kein registrierter Nutzer?</p>
                    <Link
                        to={{ pathname: "/signup" }}
                        class="inline-block px-6 py-2 border-2 border-sky-600 text-sky-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                    >
                        Anlegen
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
