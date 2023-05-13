import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from '../components/Home';
import Login from "../components/Auth/Login";
import SignOut from "../components/Auth/Signout";
import AddCandidate from "../components/AddCandidate";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import userStore from "../stores/userStore";
import Candidates from "../components/Candidates";
import Error from "../components/Error";
import Courses from "../components/Courses";
import AppConfig from "../stores/appStore";
import EmailTemplates from "../components/EmailTemplates";

const AllRoutes: React.FC = () => {
    const location = useLocation();
    const appRoutes = [
        'login',
        'signout',
        'add-candidate',
        'candidates',
        'courses',
        'email-templates',
    ]

    useEffect(() => {
        AppConfig.setCurrPage(appRoutes.includes(location.pathname.substring(1,)) ? location.pathname.substring(1,) : '');
    })

    return (
        <Routes>
            <Route path="*" element={<Error statusCode={404} subTitle={"Sorry, the page you visited does not exist."} />} />
            <Route path="/" element={<Home />} />
            <Route path={appRoutes[0]} element={<Login />} />
            <Route path={appRoutes[1]} element={<SignOut />} />
            <Route element={<ProtectedRoute user={userStore.userInfo} />}>
                <Route path={appRoutes[2]} element={<AddCandidate />} />
                <Route path={appRoutes[3]} element={<Candidates />} action={() => AppConfig.setCurrPage('Candidates')} />
                <Route path={appRoutes[4]} element={<Courses />} />
                <Route path={appRoutes[5]} element={<EmailTemplates />} />
                {/* <Route path="explore" element={<Explore />} /> */}
            </Route>
        </Routes>
    );
}
export default AllRoutes;