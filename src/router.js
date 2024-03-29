import * as React from "react";
import { createRoot } from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
} from "react-router-dom";
import Home from "./Components/Home.js";
import PlayVideoHLS from "./Components/PlayVideoHLS";
import LoginGoogle from "./Components/LoginGoogle";
import VerifyEmail from "./Components/VerifyEmail";
import Chat from "./Components/Chat";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "playvideohls",
        element: <PlayVideoHLS />,
    },
    {
        path: "logingoogle",
        element: <LoginGoogle />,
    },
    {
        path: "verify-email",
        element: <VerifyEmail />,
    },
    {
        path: "chat",
        element: <Chat />,
    },
]);

export default router;
