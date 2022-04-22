import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../ui/Card";
import classes from "./SingleTicket.module.css";
import LoadingSpinner from "../helpers/loading-spinner";
import { getSingleIssue, updateSingleIssue } from "../helpers/api-calls";

const SingleTicket = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState();
    const [images, setImages] = useState([]);
    const [solvedStatus, setSolvedStatus] = useState(false);

    const currentDomain = window.location.hostname;

    const handleOnButtonClick = () => {
        updateSingleIssue(
            currentDomain,
            id,
            setData,
            setSolvedStatus,
            solvedStatus
        );
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
    }, [currentDomain, id, setSolvedStatus, setImages, setData, setIsLoading]);

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
                <p>Nutzer: {data.username}</p>
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
                    console.log(image);
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
