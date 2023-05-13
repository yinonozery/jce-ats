import React, { useEffect } from 'react';
import AllRoutes from './routes/AllRoutes';
import FullLayout from './components/FullLayout';
import { observer } from "mobx-react";
import { BrowserRouter as Router } from "react-router-dom";
import userStore from './stores/userStore';
import firebase from './firebase/firebase';
import AppConfig from './stores/appStore';
import { Spin } from 'antd';
import './assets/css/App.css';

const App: React.FC = () => {

  useEffect(() => {
    firebase.auth.onAuthStateChanged((user: any) => {
      if (user) {
        userStore.setUser(user)
      } else {
        userStore.setUser(null)
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.userInfo])

  return (
    <>
      <div id="overlay" style={{ display: AppConfig.isLoading ? 'flex' : 'none' }}><Spin size='large' /></div>
      <Router>
        <FullLayout>
          <AllRoutes />
        </FullLayout>
      </Router>
    </>
  );
};

export default observer(App);