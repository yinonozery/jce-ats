import { Navigate, NavigateProps, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spin } from "antd";
import { observer } from "mobx-react";
import userStore from "../../stores/userStore";

const ProtectedRoute = ({ to }: NavigateProps) => {
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!userStore.userInfo?.uid) {
            const timeoutId = setTimeout(() => {
                setRedirect(true);
            }, 2500);

            return () => clearTimeout(timeoutId);
        }
    }, []);

    if (!userStore.userInfo?.uid) {
        return (
            <>
                <h3>Not Authorized</h3>
                <p>You are not authorized to perform this operation.</p>
                <p>Please wait while we redirect you to the login page...</p>
                {redirect && <Navigate to={to} replace />}
                <div style={{ textAlign: "center", marginTop: "40px" }}>
                    <Spin size="large" delay={300} />
                </div>
            </>
        );
    } else {
        return <Outlet />;
    }
};

export default observer(ProtectedRoute);
