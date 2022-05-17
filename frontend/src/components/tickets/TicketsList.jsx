import { useContext } from "react";
import Ticket from "./Ticket";
import AuthContext from "../auth/auth-context";
import { Link, useNavigate } from "react-router-dom";

const TicketsList = (props) => {
    const { user } = useContext(AuthContext);
    let { tickets } = props;
    tickets.sort((a, b) => b.timestamp - a.timestamp);
    const navigate = useNavigate();

    if (!user) {
        navigate("/");
    }

    if (tickets.length > 0) {
        return (
            <div className="w-full mt-4 pl-10 pr-10">
                <div className="bg-white overflow-auto rounded">
                    <table className="min-w-full bg-white">
                        <thead className="bg-sky-600 text-white">
                            <tr key="head">
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                                    Status
                                </th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                                    Title
                                </th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                                    Nutzername
                                </th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                                    Sektion
                                </th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                                    Datum und Zeit
                                </th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                                    Anhang
                                </th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm" />
                            </tr>
                        </thead>
                        <tbody className="text-gray-900">
                            {tickets.map((ticket, index) => {
                                const timestamp = new Date(ticket.timestamp);
                                const dateAndTime = `${
                                    (timestamp.getDate() < 10 ? "0" : "") +
                                    timestamp.getDate()
                                }.${
                                    (timestamp.getMonth() + 1 < 10 ? "0" : "") +
                                    (timestamp.getMonth() + 1)
                                }.${timestamp.getFullYear()} ${
                                    (timestamp.getHours() < 10 ? "0" : "") +
                                    timestamp.getHours()
                                }:${
                                    (timestamp.getMinutes() < 10 ? "0" : "") +
                                    timestamp.getMinutes()
                                }`;

                                return (
                                    <tr
                                        className={
                                            index % 2 !== 0 ? "bg-gray-200" : ""
                                        }
                                        key={ticket.id}
                                    >
                                        <td className="text-left py-3 px-4">
                                            {ticket.solved ? "✅" : "❗"}
                                        </td>
                                        <td className="text-left py-3 px-4">
                                            {ticket.title}
                                        </td>
                                        <td className="text-left py-3 px-4">
                                            {ticket.username}
                                        </td>
                                        <td className="text-left py-3 px-4">
                                            {ticket.section}
                                        </td>
                                        <td className="text-left py-3 px-4">
                                            {dateAndTime}
                                        </td>
                                        <td className="text-left py-3 px-4">
                                            {ticket.attachments
                                                ? ticket.attachments.split(", ")
                                                      .length
                                                : "0"}
                                        </td>
                                        <td className="text-left py-3 px-4">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/tickets/${ticket.id}`
                                                    )
                                                }
                                                className="inline-block px-6 py-2 border-2 border-sky-600 text-sky-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                                            >
                                                Bearbeiten
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return <p>Keine Tickets verfügbar.</p>;
};

export default TicketsList;
