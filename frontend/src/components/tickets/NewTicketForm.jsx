import { useRef } from "react";
import Card from "../ui/Card";
import classes from "./NewTicketForm.module.css";

const NewTicketForm = (props) => {
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
                <div className={classes.actions}>
                    <button>Ticket anlegen</button>
                </div>
            </form>
        </Card>
    );
};

export default NewTicketForm;
