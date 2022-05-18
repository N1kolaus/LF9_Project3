import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
        <div className="w-full mt-4 pl-10 pr-10 text-gray-900">
            <div className="container max-w-3xl">
                <div className="flex items-center justify-between mt-4 ">
                    <h2 className="text-5xl font-semibold">{data.title}</h2>
                    <button
                        onClick={handleOnButtonClick}
                        className="inline-block px-6 py-2 rounded bg-sky-600 text-white shadow-lg uppercase tracking-wider font-semibold hover:bg-sky-900 hover:shadow-lg"
                    >
                        {solvedStatus ? "Ticket öffnen" : "Ticket schließen"}
                    </button>
                </div>
                <div className="mt-6 p-4 grid grid-cols-6 gap-2 justify-start content-start border-2 border-gray-900 rounded bg-gray-200 text-gray-900">
                    <p className="font-semibold">Bereich: </p>
                    <p className="col-span-5">{data.section}</p>
                    <p className="font-semibold">Datum: </p>
                    <p className="col-span-5">{outputDate}</p>
                    <p className="font-semibold">Nutzer: </p>
                    <p className="col-span-5">{data.username}</p>
                    <p className="font-semibold">Email: </p>
                    <p className="col-span-5">{data.email}</p>
                    <p className="font-semibold">Status:</p>
                    <p className="col-span-5">
                        {solvedStatus ? "Abgeschlossen" : "Offen"}
                    </p>
                    <p className="font-semibold">Anhänge:</p>
                    <p className="col-span-5">
                        {attachments.length > 1 ? (
                            <p>{attachments.length} Anhänge</p>
                        ) : attachments[0] !== "no attachments" ? (
                            <p>1 Anhang</p>
                        ) : (
                            <p>Keine Anhänge</p>
                        )}
                    </p>
                    <p className="font-semibold">Beschreibung:</p>
                    <p className="col-span-5">{data.issue}</p>
                    {images.length === attachments.length &&
                        images.map((image) => {
                            console.log("image", image);
                            return (
                                <div
                                    key={image.toString()}
                                    className="col-span-6 p-2"
                                >
                                    <img
                                        src={image}
                                        alt={data.title}
                                        key={image.toString()}
                                        className="object-scale-down h-96 w-182 rounded"
                                    />
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default SingleTicket;
