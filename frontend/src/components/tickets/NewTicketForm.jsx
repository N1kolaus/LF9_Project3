import { useRef, useState } from "react";
import Card from "../ui/Card";
import FormData from "form-data";
import { useContext } from "react";
import AuthContext from "../auth/auth-context";

const NewTicketForm = (props) => {
    const { user } = useContext(AuthContext);
    const [selectedFile, setSelectedFile] = useState([]);
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [attachmentsList, setAttachmentsList] = useState([]);
    const sectionInputRef = useRef();
    const titleInputRef = useRef();
    const issueInputRef = useRef();

    const handleOnSubmit = (event) => {
        event.preventDefault();

        const ticketData = {
            email: user.email,
            username: user.username,
            section: sectionInputRef.current.value,
            title: titleInputRef.current.value,
            issue: issueInputRef.current.value,
            attachments:
                attachmentsList.length > 0
                    ? attachmentsList.join(", ")
                    : "no attachments",
            solved: false,
            timestamp: Date.now(), // get current timestamp
        };

        const formData = new FormData();
        for (const [key, value] of Object.entries(ticketData)) {
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
        <div className="w-full mt-4 pl-10 pr-10 text-gray-900">
            <div className="container max-w-3xl">
                <div className="border-2 border-gray-900 rounded bg-gray-200">
                    <form
                        onSubmit={handleOnSubmit}
                        encType="multipart/form-data"
                        className="p-4"
                    >
                        <div className="mt-2 text-gray-900">
                            <input
                                type="text"
                                required
                                id="title"
                                ref={titleInputRef}
                                placeholder="Titel"
                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            />
                        </div>
                        <div className="mt-2 text-gray-900">
                            <select
                                required
                                name="section"
                                id="section"
                                ref={sectionInputRef}
                                placeholder="Bereich"
                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            >
                                <option value="Hardware">Hardware</option>
                                <option value="Network">Netzwerk</option>
                                <option value="Security">Sicherheit</option>
                                <option value="Software">Software</option>
                            </select>
                        </div>
                        <div className="mt-2 text-gray-900">
                            <textarea
                                required
                                rows="5"
                                id="issue"
                                ref={issueInputRef}
                                placeholder="Problembeschreibung"
                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            ></textarea>
                        </div>
                        <div className="mt-2 text-gray-900">
                            <input
                                type="file"
                                name="file"
                                onChange={changeHandler}
                                multiple
                                class="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded file:border-0
      file:text-sm file:font-semibold
      file:bg-sky-600 file:text-white
      hover:file:bg-sky-900
    "
                            />
                            {isFilePicked ? (
                                <div className="mt-2 text-slate-500">
                                    <p>Dateien:</p>
                                    <ul>
                                        {attachmentsList.map((attachment) => (
                                            <li key={attachment}>
                                                {attachment}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p></p>
                            )}
                        </div>
                        <div className="flex justify-end">
                            <button className="block px-6 py-2 rounded bg-sky-600 text-white shadow-lg uppercase tracking-wider font-semibold hover:bg-sky-900 hover:shadow-lg">
                                Ticket anlegen
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewTicketForm;
