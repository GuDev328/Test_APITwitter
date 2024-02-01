import { useEffect, useState } from "react";
import socket from "../socket";

export default function Chat() {
    const [value, setValue] = useState(" ");
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        socket.auth = {
            _id: JSON.parse(localStorage.getItem("user"))._id,
        };
        socket.connect();
        socket.on("receiver-chat", (data) => {
            setMessages((messages) => [...messages, data]);
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit("chat", {
            content: value,
            to: "65ba6d4f28b1005a27e466ae", //id user datbbu
        });
        setValue("");
    };

    return (
        <div className="flex flex-col justify-center items-center w-screen h-screen">
            <div className="w-1/2">
                {messages.map((message) => (
                    <div key={message._id}>
                        <div class="bg-blue-500 inline-block text-white p-2 rounded-md max-w-52 m-1">
                            <p class="text-sm break-words">{message.content}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-1/2">
                <form onSubmit={handleSubmit}>
                    <input
                        value={value}
                        className="border-solid border-2 border-gray-400 rounded-lg p-2 w-4/5"
                        type="text"
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Gửi
                    </button>
                </form>
            </div>
        </div>
    );
}
