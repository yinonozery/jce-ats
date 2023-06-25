import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from '../components/Home';
import Login from '../components/auth/Login';
import AddCandidate from '../components/AddCandidate';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import userStore from '../stores/userStore';
import Candidates from '../components/Candidates';
import Error from '../components/Error';
import Courses from '../components/Courses';
import appConfig from '../stores/appStore';
import EmailTemplates from '../components/EmailTemplates';
import GoogleCalendar from '../utils/videoServices/GoogleCalendar';

const AllRoutes: React.FC = () => {
    const location = useLocation();
    const appRoutes = [
        'login',
        'add-candidate',
        'candidates',
        'courses',
        'email-templates',
        'meeting'
    ]

    useEffect(() => {
        if (appRoutes.includes(location.pathname.substring(1,)))
            appConfig.setCurrPage(location.pathname.substring(1,))
        else {
            appConfig.setCurrPage('');
            document.title = process.env.REACT_APP_WINDOW_TITLE || '';
        }
    })

    return (
        <Routes>
            <Route path='*' element={<Error statusCode={404} subTitle={'Sorry, the page you visited does not exist.'} />} />
            <Route path={'/'} element={<Home />} />
            <Route path={appRoutes[0]} element={<Login />} />
            <Route element={<ProtectedRoute user={userStore.userInfo} />}>
                <Route path={appRoutes[1]} element={<AddCandidate />} />
                <Route path={appRoutes[2]} element={<Candidates />} />
                <Route path={appRoutes[3]} element={<Courses />} />
                <Route path={appRoutes[4]} element={<EmailTemplates />} />
                <Route path={appRoutes[5]} element={<GoogleCalendar />} />
            </Route>
        </Routes>
    );
}
export default AllRoutes;