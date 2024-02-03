import { useEffect, useState } from "react";
import socket from "../socket";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Chat() {
    const [value, setValue] = useState("");
    const [receiver, setReceiver] = useState("");
    const [userSelected, setUserSelected] = useState("");
    const [messages, setMessages] = useState([]);
    const [isConnectedSocket, setIsConnectedSocket] = useState(false);
    const [pagiantion, setPagination] = useState({
        page: 1,
        total_page: 0,
    });
    useEffect(() => {
        if (localStorage.getItem("access_token")) {
            socket.auth = {
                access_token: localStorage.getItem("access_token"),
            };
            socket.connect();
            setIsConnectedSocket(true);
            socket.on("disconnect", () => {
                setIsConnectedSocket(false);
                console.log("socket disconnected");
            });
            socket.on("connect_error", (err) => {
                setIsConnectedSocket(false);
                console.log(err);
            });
            return () => {
                socket.disconnect();
                setIsConnectedSocket(false);
            };
        } else {
            alert("Vui lòng đăng nhập để chat");
            window.location.href = "/";
        }
    }, []);

    useEffect(() => {
        socket.off("receiver-chat");
        socket.on("receiver-chat", (data) => {
            if (data.sender_id === receiver) {
                setMessages((messages) => [
                    {
                        sender_id: data.sender_id,
                        receiver_id: data.receiver_id,
                        content: data.content,
                    },
                    ...messages,
                ]);
            }
        });
        if (receiver) {
            const info = axios
                .get(`/conversations/get-conversation/${receiver}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                    params: {
                        limit: 10,
                        page: 1,
                    },
                    baseURL: "http://localhost:3030",
                })
                .then((res) => {
                    setMessages(res.data.result);
                    setPagination({
                        total_page: res.data.total_page,
                        page: res.data.page,
                    });
                });
        }
    }, [receiver]);

    const usernames = ["datminiphi", "datbbu328", "menephe"];
    const user = JSON.parse(localStorage.getItem("user"));

    const getProfile = async (username) => {
        setUserSelected(username);
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
        if (isConnectedSocket) {
            setMessages((messages) => [
                {
                    sender_id: user._id,
                    receiver_id: receiver,
                    content: value,
                },
                ...messages,
            ]);
        }
        setValue("");
    };

    const fetchMoreMessages = async () => {
        if (receiver && pagiantion.page < pagiantion.total_page) {
            const info = await axios
                .get(`/conversations/get-conversation/${receiver}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                    params: {
                        limit: 10,
                        page: pagiantion.page + 1,
                    },
                    baseURL: "http://localhost:3030",
                })
                .then((res) => {
                    setMessages((messages) => [
                        ...messages,
                        ...res.data.result,
                    ]);
                    setPagination({
                        total_page: res.data.total_page,
                        page: res.data.page,
                    });
                });
        }
    };

    return (
        <div className="flex">
            <div className="flex flex-col  w-1/5 h-screen">
                {usernames.map((username) => (
                    <button
                        onClick={() => getProfile(username)}
                        className={`${
                            userSelected === username
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                        } hover:bg-blue-700 text-white inline-block m-5 font-bold py-2 px-4 rounded`}
                    >
                        {username}
                    </button>
                ))}
            </div>

            <div className="flex flex-col justify-end items-center w-4/5 h-screen">
                <div
                    className=""
                    id="scrollableDiv"
                    style={{
                        width: "70%",
                        height: 400,
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column-reverse",
                    }}
                >
                    {/*Put the scroll bar always on the bottom*/}
                    <InfiniteScroll
                        className=""
                        dataLength={messages.length}
                        next={fetchMoreMessages}
                        style={{
                            display: "flex",
                            flexDirection: "column-reverse",
                        }} //To put endMessage and loader to the top.
                        inverse={true} //
                        hasMore={true}
                        loader={<></>}
                        scrollableTarget="scrollableDiv"
                    >
                        {messages.map((message) => (
                            <div className="">
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
                    </InfiniteScroll>
                </div>
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
