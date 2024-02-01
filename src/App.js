import "./App.css";
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
} from "react-router-dom";
import router from "./router";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { useEffect } from "react";
import axios from "axios";

function App() {
    useEffect(() => {
        if (localStorage.getItem("access_token")) {
            const controller = new AbortController();
            axios
                .get("/users/get-me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                    baseURL: "http://localhost:3030",
                    signal: controller.signal,
                })
                .then((res) => {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(res.data.result)
                    );
                    console.log(res.data.result);
                });
        }
    });
    return <RouterProvider router={router} />;
}

export default App;
