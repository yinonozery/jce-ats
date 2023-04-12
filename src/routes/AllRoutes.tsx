import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from '../components/Home';
import Login from "../components/Auth/Login";
import SignOut from "../components/Auth/Signout";
import AddCandidate from "../components/AddCandidate";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import userStore from "../stores/userStore";
import Candidates from "../components/Candidates";
import AddCourse from "../components/AddCourse";
import Error from "../components/Error";
import Courses from "../components/Courses";
import AppConfig from "../stores/appStore";
import EmailTemplates from "../components/EmailTemplates";
import Explore from "../components/Explore";

const AllRoutes: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        AppConfig.setCurrPage(location.pathname.substring(1,));
    }, [location])

    return (
        <Routes>
            <Route path="*" element={<Error statusCode={404} subTitle={"Sorry, the page you visited does not exist."} />} />
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signout" element={<SignOut />} />
            <Route element={<ProtectedRoute user={userStore.userInfo} />}>
                <Route path="add-candidate" element={<AddCandidate />} />
                <Route path="add-course" element={<AddCourse />} />
                <Route path="candidates" element={<Candidates />} action={() => AppConfig.setCurrPage('Candidates')} />
                <Route path="courses" element={<Courses />} />
                <Route path="email-templates" element={<EmailTemplates />} />
                <Route path="explore" element={<Explore />} />
            </Route>
        </Routes>
    );
}
export default AllRoutes;