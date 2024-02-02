import { useEffect, useState } from "react";
import socket from "../socket";
import axios from "axios";

export default function Chat() {
    const [value, setValue] = useState("");
    const [receiver, setReceiver] = useState("");
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        if (localStorage.getItem("user")) {
            socket.auth = {
                _id: JSON.parse(localStorage.getItem("user"))._id,
            };
            socket.connect();

            return () => {
                socket.disconnect();
            };
        } else {
            alert("Vui lòng đăng nhập để chat");
            window.location.href = "/";
        }
    }, []);

    useEffect(() => {
        socket.off("receiver-chat");
        socket.on("receiver-chat", (data) => handleReceiver(data));
        if (receiver) {
            const info = axios
                .get(`/conversations/get-conversation/${receiver}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                    query: {
                        limit: 100,
                        page: 1,
                    },
                    baseURL: "http://localhost:3030",
                })
                .then((res) => {
                    setMessages(res.data.result);
                });
        }
    }, [receiver]);

    const handleReceiver = (data) => {
        if (data.sender_id === receiver) {
            setMessages((messages) => [
                ...messages,
                {
                    sender_id: data.sender_id,
                    receiver_id: data.receiver_id,
                    content: data.content,
                },
            ]);
        }
    };

    const usernames = ["datminiphi", "datbbu328", "menephe"];
    const user = JSON.parse(localStorage.getItem("user"));

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
            sender_id: user._id,
            receiver_id: receiver,
            content: value,
        });
        setMessages((messages) => [
            ...messages,
            {
                sender_id: user._id,
                receiver_id: receiver,
                content: value,
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
                        className="bg-blue-500 hover:bg-blue-700 text-white inline-block m-5 font-bold py-2 px-4 rounded"
                    >
                        {username}
                    </button>
                ))}
            </div>
            <div className="flex flex-col justify-end items-center w-4/5 h-screen">
                {messages.map((message) => (
                    <div className="w-1/2">
                        {!(message.sender_id === user._id) ? (
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

                <div className="w-1/2 mb-12   ">
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
