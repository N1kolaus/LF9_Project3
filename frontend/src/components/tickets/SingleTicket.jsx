import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Card from "../ui/Card";
import classes from "./SingleTicket.module.css";
import LoadingSpinner from "../helpers/loading-spinner";

const SingleTicket = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState();
    const [images, setImages] = useState([]);
    const [solvedStatus, setSolvedStatus] = useState(false);

    const currentDomain = window.location.hostname;

    const handleOnButtonClick = () => {
        axios
            .patch(`http://${currentDomain}:8000/api/updateData/${id}`, {
                id: id,
                solved: !solvedStatus,
            })
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
                console.log(err);
                toast.error("Ticket konnte nicht bearbeitet werden. 😞");
            });
    };

    useEffect(() => {
        setIsLoading(true);
        axios
            .get(`http://${currentDomain}:8000/api/getData/${id}`)
            .then((response) => {
                setData(response.data.Ticket);
                setSolvedStatus(response.data.Ticket.solved);
                return response.data.Ticket;
            })
            .then((ticket) => {
                setImages([]);
                const attachments = ticket.attachments.split(", ");
                const timestamp = ticket.timestamp;

                attachments.forEach((image) => {
                    axios
                        .get(
                            `http://${currentDomain}:8000/api/getFiles/${timestamp}/${image}`,
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
                                "Daten konnten nicht abgerufen werden. 😞"
                            );
                        });
                });

                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                toast.error("Daten konnten nicht abgerufen werden. 😞");
                setIsLoading(false);
            });
    }, [currentDomain, id, setSolvedStatus]);

    if (isLoading) {
        return <LoadingSpinner isLoading={isLoading} />;
    }

    const attachments = data.attachments.split(", ");
    const date = new Date(data.timestamp);
    const outputDate = `${date.getDate()}.${
        date.getMonth() + 1
    }.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

    return (
        <Card>
            <div className={classes.content}>
                <h3>{data.title}</h3>
                <section>Bereich: {data.section}</section>
                <p>Problembeschreibung: {data.issue}</p>
                <p>Datum: {outputDate}</p>
                <p>Email: {data.email}</p>
                <p>Status: {solvedStatus ? "Abgeschlossen" : "Offen"}</p>
                {attachments.length > 1 ? (
                    <p>{attachments.length} Anhänge</p>
                ) : (
                    <p>1 Anhang</p>
                )}
            </div>
            <div className={classes.actions}>
                <button onClick={handleOnButtonClick}>
                    {solvedStatus ? "Ticket öffnen" : "Ticket schließen"}
                </button>
            </div>
            {images.length === attachments.length &&
                images.map((image) => {
                    return (
                        <div className={classes.image} key={image.toString()}>
                            <img
                                src={image}
                                alt={data.title}
                                key={image.toString()}
                            />
                        </div>
                    );
                })}
        </Card>
    );
};

export default SingleTicket;
