import axios from "axios";
import oauth from "axios-oauth-client";
import { toast } from "react-toastify";

const config = () => ({
    headers: {
        Authorization: `Bearer ${
            JSON.parse(sessionStorage.getItem("auth")).access_token
        }`,
    },
});

export const handleLogin = async (username, password, currentDomain) => {
    const getClientCredentials = oauth.client(axios.create(), {
        url: `http://${currentDomain}:8000/api/auth/token`,
        grant_type: "",
        username: username,
        password: password,
        scope: "",
    });

    try {
        const auth = await getClientCredentials();
        sessionStorage.setItem("auth", JSON.stringify(auth));

        return { user: auth };
    } catch (error) {
        return { error: error };
    }
};

export const handleSignUp = async (
    username,
    email,
    password,
    currentDomain
) => {
    const signUp = axios.post(`http://${currentDomain}:8000/api/auth/user`, {
        username,
        email,
        password,
    });

    return { user: signUp };
};

export const handleLogout = () => {
    sessionStorage.removeItem("auth");
};

export const getAllData = (currentDomain, setData, setIsLoading) => {
    return axios
        .get(`http://${currentDomain}:8000/api/issues/allData`, config())
        .then((response) => {
            setData(response.data);
            setIsLoading(false);
        })
        .catch((err) => {
            toast.error("Daten konnten nicht abgerufen werden. 😞");
            setIsLoading(false);
        });
};

export const getSingleIssue = (
    currentDomain,
    setData,
    setSolvedStatus,
    setIsLoading,
    setImages,
    id
) => {
    return axios
        .get(`http://${currentDomain}:8000/api/issues/getData/${id}`, config())
        .then((response) => {
            console.log(response);
            setData(response.data);
            setSolvedStatus(response.data.solved);
            return response.data;
        })
        .then((ticket) => {
            setImages([]);
            const attachments = ticket.attachments.split(", ");
            const timestamp = ticket.timestamp;

            if (attachments[0] !== "no attachments") {
                attachments.forEach((image) => {
                    axios
                        .get(
                            `http://${currentDomain}:8000/api/issues/getFiles/${timestamp}/${image}`,
                            config(),
                            {
                                responseType: "arraybuffer",
                            }
                        )
                        .then((response) => {
                            let blob = new Blob([response.data], {
                                type: response.headers["content-type"],
                            });
                            let image = URL.createObjectURL(blob);
                            setImages((oldImages) => [...oldImages, image]);
                        })
                        .catch((err) => {
                            console.log(err);
                            toast.error(
                                "Attachments konnte nicht geladen werden. 😞"
                            );
                        });
                });
            }

            setIsLoading(false);
        })
        .catch((err) => {
            console.log(err);
            toast.error("Daten konnten nicht abgerufen werden. 😞");
            setIsLoading(false);
        });
};

export const updateSingleIssue = (
    currentDomain,
    id,
    setData,
    setSolvedStatus,
    solvedStatus
) => {
    return axios
        .patch(
            `http://${currentDomain}:8000/api/issues/updateData/${id}?update=${solvedStatus}`,
            config()
        )
        .then((response) => {
            setData(response.data);
            setSolvedStatus(!solvedStatus);
            toast.success(
                `Neuer Ticketstatus: ${
                    !solvedStatus ? "Abgeschlossen! 🥳" : "Offen ⚙️"
                } `
            );
        })
        .catch((err) => {
            console.log(err.response);
            toast.error("Ticket konnte nicht bearbeitet werden. 😞");
        });
};
