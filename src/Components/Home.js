import { Link } from "react-router-dom";

export default function Home() {
    const isAuthenticated = Boolean(localStorage.getItem("access_token"));
    const onClickLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.reload();
    };
    return (
        <div className="h-screen w-screen flex justify-around items-center">
            {isAuthenticated ? (
                <button
                    onClick={onClickLogout}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Đã đăng nhập, Logout??
                </button>
            ) : (
                <Link to="/logingoogle">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Đăng nhập với Google
                    </button>
                </Link>
            )}

            <Link to="/playvideohls">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Xem video HLS
                </button>
            </Link>
        </div>
    );
}
