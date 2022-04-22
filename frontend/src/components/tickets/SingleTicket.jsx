import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Card from "../ui/Card";
import classes from "./SingleTicket.module.css";
import LoadingSpinner from "../helpers/loading-spinner";
import { getSingleIssue } from "../helpers/api-calls";

const SingleTicket = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState();
    const [images, setImages] = useState([]);
    const [solvedStatus, setSolvedStatus] = useState(false);

    const currentDomain = window.location.hostname;

    const handleOnButtonClick = () => {
        axios
            .patch(
                `http://${currentDomain}:8000/api/issues/updateData/${id}?update=${!solvedStatus}`,
                JSON.stringify({
                    issue_id: parseInt(id),
                    update: !solvedStatus,
                }),
                {
                    headers: {
                        Authorization: `Bearer ${
                            JSON.parse(sessionStorage.getItem("auth"))
                                .access_token
                        }`,
                    },
                }
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
                console.log(err);
                toast.error("Ticket konnte nicht bearbeitet werden. 😞");
            });
    };

    useEffect(() => {
        setIsLoading(true);
        getSingleIssue(
            currentDomain,
            setData,
            setSolvedStatus,
            setIsLoading,
            setImages,
            id
        );
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
                <h2>{data.title}</h2>
                <section>Bereich: {data.section}</section>
                <p>Problembeschreibung: {data.issue}</p>
                <p>Datum: {outputDate}</p>
                <p>Email: {data.email}</p>
                <p>Status: {solvedStatus ? "Abgeschlossen" : "Offen"}</p>
                {attachments.length > 1 ? (
                    <p>{attachments.length} Anhänge</p>
                ) : attachments[0] !== "no attachments" ? (
                    <p>1 Anhang</p>
                ) : (
                    <p>Keine Anhänge</p>
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
