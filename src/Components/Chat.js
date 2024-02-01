import { useEffect, useState } from "react";
import socket from "../socket";
import axios from "axios";

export default function Chat() {
    const [value, setValue] = useState("");
    const [receiver, setReceiver] = useState("");
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        socket.auth = {
            _id: JSON.parse(localStorage.getItem("user"))._id,
        };
        socket.connect();
        socket.on("receiver-chat", (data) => {
            setMessages((messages) => [
                ...messages,
                {
                    content: data.content,
                    isSender: false,
                },
            ]);
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    const usernames = ["datminiphi", "datbbu328", "menephe"];

    const getProfile = async (username) => {
        const info = await axios.get(
            `/users/get-profile/?username=${username}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "access_token"
                    )}`,
                },
                baseURL: "http://localhost:3030",
            }
        );

        setReceiver(info.data.result._id);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit("chat", {
            content: value,
            to: receiver, //id user datbbu
        });
        setMessages((messages) => [
            ...messages,
            {
                content: value,
                isSender: true,
            },
        ]);
        setValue("");
    };

    return (
        <div className="flex">
            <div className="flex flex-col  w-1/5 h-screen">
                {usernames.map((username) => (
                    <button
                        onClick={() => getProfile(username)}
                        key={username}
                        className="bg-blue-500 hover:bg-blue-700 text-white inline-block m-5 font-bold py-2 px-4 rounded"
                    >
                        {username}
                    </button>
                ))}
            </div>
            <div className="flex flex-col justify-center items-center w-4/5 h-screen">
                {messages.map((message) => (
                    <div className="w-1/2">
                        {!message.isSender ? (
                            <div className="w-1/2">
                                <div class="bg-blue-500 text-white block p-2 rounded-md float-start m-1">
                                    <p class="text-sm break-words inline-block">
                                        {message.content}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-1/2 float-end">
                                <div class="bg-blue-500 text-white block p-2 rounded-md float-end m-1">
                                    <p class="text-sm break-words inline-block">
                                        {message.content}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

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
                            className="bg-blue-500 hover:bg-blue-700 text-white w-1/6 ml-2 font-bold py-2 px-4 rounded"
                        >
                            Gửi
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
