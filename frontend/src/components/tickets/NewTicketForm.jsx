import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Card from "../ui/Card";
import classes from "./NewTicketForm.module.css";
import FormData from "form-data";

const NewTicketForm = (props) => {
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [attachmentsList, setAttachmentsList] = useState([]);
    const emailInputRef = useRef();
    const sectionInputRef = useRef();
    const titleInputRef = useRef();
    const issueInputRef = useRef();
    const attachmentsInputRef = useRef();

    const handleOnSubmit = (event) => {
        event.preventDefault();

        const enteredEmail = emailInputRef.current.value;
        const enteredSection = sectionInputRef.current.value;
        const enteredTitle = titleInputRef.current.value;
        const enteredIssue = issueInputRef.current.value;
        const enteredAttachments = attachmentsInputRef.current.value;

        const ticketData = {
            email: enteredEmail,
            section: enteredSection,
            title: enteredTitle,
            issue: enteredIssue,
            attachments: enteredAttachments,
            solved: false,
            timestamp: Math.floor(new Date().getTime() / 1000), // get current timestamp
        };

        props.onNewTicket(ticketData);
    };

    const handleSubmission = async (event) => {
        event.preventDefault();
        const currentDomain = window.location.hostname;

        const formData = new FormData();
        console.log(selectedFile);
        formData.append("file", selectedFile, selectedFile.name);

        return await axios
            .post(`http://${currentDomain}:8000/api/upload`, formData)
            .then((response) => {
                console.log(response);
                toast.success("Bild erfolgreich gespeichert. 😊");
                // navigate("/");
            })
            .catch((err) => {
                console.log(err);
                toast.error("Bild konnte nicht gesendet werden. 😞");
            });
    };

    const changeHandler = async (event) => {
        const imageData = event.target.files[0];
        const currentTimestamp = Math.floor(new Date().getTime() / 1000);
        const imageSaveName = `${currentTimestamp}_${imageData.name}`;

        setSelectedFile({
            name: imageSaveName,
            size: imageData.size,
            type: imageData.type,
            lastModified: imageData.lastModified,
        });

        setAttachmentsList((prevState) => [...prevState, imageSaveName]);

        setIsFilePicked(true);
    };

    return (
        <Card>
            <form className={classes.form} onSubmit={handleOnSubmit}>
                <div className={classes.control}>
                    <label htmlFor="title">Titel</label>
                    <input
                        type="text"
                        required
                        id="title"
                        ref={titleInputRef}
                    />
                </div>
                <div className={classes.control}>
                    <label htmlFor="section">Bereich</label>
                    <select
                        required
                        name="section"
                        id="section"
                        ref={sectionInputRef}
                    >
                        <option value="hardware">Hardware</option>
                        <option value="network">Netzwerk</option>
                        <option value="security">Sicherheit</option>
                        <option value="software">Software</option>
                    </select>
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
                    <label htmlFor="issue">Problembeschreibung</label>
                    <textarea
                        required
                        rows="5"
                        id="issue"
                        ref={issueInputRef}
                    ></textarea>
                </div>
                <div className={classes.control}>
                    <label htmlFor="attachments">Anhang</label>
                    <input
                        type="text"
                        required
                        id="attachments"
                        ref={attachmentsInputRef}
                    />
                </div>
                <div className={classes.control}>
                    <input type="file" name="file" onChange={changeHandler} />
                    {isFilePicked ? (
                        <div>
                            <p>Files:</p>
                            <ul>
                                {attachmentsList.map((attachment) => (
                                    <li key={attachment}>{attachment}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>Select a file to show details</p>
                    )}
                    <div>
                        <button onClick={handleSubmission}>Submit</button>
                    </div>
                </div>
                <div className={classes.actions}>
                    <button>Ticket anlegen</button>
                </div>
            </form>
        </Card>
    );
};

export default NewTicketForm;
