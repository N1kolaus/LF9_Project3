import { useRef, useState } from "react";
import Card from "../ui/Card";
import classes from "./NewTicketForm.module.css";
import FormData from "form-data";

const NewTicketForm = (props) => {
    const [selectedFile, setSelectedFile] = useState([]);
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [attachmentsList, setAttachmentsList] = useState([]);
    const emailInputRef = useRef();
    const sectionInputRef = useRef();
    const titleInputRef = useRef();
    const issueInputRef = useRef();

    const handleOnSubmit = (event) => {
        event.preventDefault();

        const ticketData = {
            email: emailInputRef.current.value,
            section: sectionInputRef.current.value,
            title: titleInputRef.current.value,
            issue: issueInputRef.current.value,
            attachments:
                attachmentsList.length > 0
                    ? attachmentsList.join(", ")
                    : "no attachments",
            solved: false,
            timestamp: Math.floor(new Date().getTime() / 1000), // get current timestamp
        };

        const formData = new FormData();
        for (const [key, value] of Object.entries(ticketData)) {
            console.log(`${key}: ${value}`);
            formData.append(key, value);
        }
        for (var i = 0; i < selectedFile.length; i++) {
            formData.append("files", selectedFile[i]);
        }

        props.onNewTicket(formData);
    };

    const changeHandler = async (event) => {
        const files = event.target.files;
        const filenames = [];
        Array.from(files).forEach((file) => {
            filenames.push(file.name);
        });

        setSelectedFile((prevState) => [...prevState, ...files]);
        setAttachmentsList((prevState) => [...prevState, ...filenames]);
        setIsFilePicked(true);
    };

    return (
        <Card>
            <form
                className={classes.form}
                onSubmit={handleOnSubmit}
                encType="multipart/form-data"
            >
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
                    <input
                        type="file"
                        name="file"
                        onChange={changeHandler}
                        multiple
                    />
                    {isFilePicked ? (
                        <div>
                            <p>Dateien:</p>
                            <ul>
                                {attachmentsList.map((attachment) => (
                                    <li key={attachment}>{attachment}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p></p>
                    )}
                </div>
                <div className={classes.actions}>
                    <button>Ticket anlegen</button>
                </div>
            </form>
        </Card>
    );
};

export default NewTicketForm;
