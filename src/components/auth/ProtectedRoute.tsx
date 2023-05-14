
import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import { Spin } from "antd";

const ProtectedRoute = ({ user, redirectPath = '/login' }: any) => {
    const [redirect, setRedirect] = useState(false);
    if (!user) {
        setTimeout(() => {
            setRedirect(true)
        }, 1500)
        return (
            <>
                <h3>Not Authorized</h3>
                You are not authorized to perform this operation,<br />
                Please wait while we redirect you to the login page...
                {redirect && <Navigate to={redirectPath} replace />}
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <Spin size="large" delay={300} />
                </div>
            </>
        )
    }
    else
        return <Outlet />;
}

export default ProtectedRoute;