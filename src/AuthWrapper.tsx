import React, { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import firebase from './firebase/firebase';
import userStore from './stores/userStore';

const AuthWrapper: React.FC<{ children: ReactNode }> = (props) => {
    const location = useLocation();
    useEffect(() => {
        const authListener = firebase.auth.onAuthStateChanged((user: any) => {
            if (user) {
                userStore.setUser(user);
            } else {
                userStore.setUser(null);
            }
        });

        return () => {
            authListener();
        };

    }, [location]);

    return <>{props.children}</>;
}

export default AuthWrapper;
