import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

export default function VerifyEmail() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            const emailVerifyToken = params.get("token");
            if (emailVerifyToken) {
                if (!localStorage.getItem("access_token")) {
                    alert("Bạn chưa đăng nhập");
                    navigate("/logingoogle");
                }
                try {
                    const res = await axios.post(
                        "http://localhost:3030/users/verify-email",
                        {
                            emailVerifyToken,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                    "access_token"
                                )}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    alert("Xác thực email thành công");
                } catch (error) {
                    console.log(error.response.data);

                    alert(error.response.data.message);
                }
            }
        };

        verifyEmail();
    }, [params]);

    return <div>a</div>;
}
