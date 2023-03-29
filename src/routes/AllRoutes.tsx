import { Routes, Route } from "react-router-dom";
import Home from '../components/Home';
import Login from "../components/Auth/Login";
import SignOut from "../components/Auth/Signout";
import AddResume from "../components/AddResume";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import userStore from "../stores/userStore";
import Candidates from "../components/Candidates";
import AddCourse from "../components/AddCourse";
import Error from "../components/Error";
import Courses from "../components/Courses";

const AllRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="*" element={<Error statusCode={404} subTitle={"Sorry, the page you visited does not exist."} />} />
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signout" element={<SignOut />} />
            <Route element={<ProtectedRoute user={userStore.userInfo} />}>
                <Route path="addresume" element={<AddResume />} />
                <Route path="addcourse" element={<AddCourse />} />
                <Route path="candidates" element={<Candidates />} />
                <Route path="courses" element={<Courses />} />
            </Route>
        </Routes>
    );
}
export default AllRoutes;