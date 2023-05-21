import React from 'react';
import AllRoutes from './routes/AllRoutes';
import FullLayout from './components/FullLayout';
import { BrowserRouter as Router } from "react-router-dom";
import AuthWrapper from './components/auth/AuthWrapper';
import Spinner from './utils/Spinner';
import './assets/css/App.css';

const App: React.FC = () => {
  return (
    <>
      <Spinner />
      <Router>
        <AuthWrapper>
          <FullLayout>
            <AllRoutes />
          </FullLayout>
        </AuthWrapper>
      </Router>
    </>
  );
};

export default App;