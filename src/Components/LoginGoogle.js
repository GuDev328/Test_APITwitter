import { useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const getGoogleAuthUrl = () => {
    const url = "https://accounts.google.com/o/oauth2/v2/auth";
    const query = {
        client_id:
            "814138204333-i7jssscd8e2j1ftab835e8qhrji951ns.apps.googleusercontent.com",
        redirect_uri: "http://localhost:3030/users/oauth/google",
        response_type: "code",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
        prompt: "consent",
        access_type: "offline",
    };
    const queryString = new URLSearchParams(query).toString();
    return `${url}?${queryString}`;
};

const link = getGoogleAuthUrl();

export default function LoginGoogle() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    useEffect(() => {
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        if (access_token && refresh_token) {
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            navigate("/");
        }
    }, [params]);
    return (
        <div>
            <Link
                to={link}
                className="h-screen w-screen flex justify-center items-center"
            >
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Đăng nhập với Google
                </button>
            </Link>
        </div>
    );
}
