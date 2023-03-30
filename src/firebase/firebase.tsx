import { initializeApp } from "firebase/app";
import { setPersistence, getAuth, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, browserSessionPersistence } from "firebase/auth";
import userStore from "../stores/userStore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const doSignInWithEmailAndPassword = (email: string, password: string) =>
    setPersistence(auth, browserSessionPersistence).then(() => {
        return signInWithEmailAndPassword(auth, email, password).then((user) => {
            if (user.user)
                userStore.setUser(user.user)
            else
                userStore.setUser(null)
        }).catch((err) => {
            throw err;
        });
    })

const doSignOut = () =>
    signOut(auth).then(() => {
        userStore.setUser(null)
        window.location.href = '/'
    }).catch((err) => console.error(err));

const doResetPassword = (email: string) =>
    sendPasswordResetEmail(auth, email).then(() => {
        return true;
    }).catch((err) => {
        console.error(err);
        throw err;
    });

// Export firebase methods
const firebase = {
    doSignInWithEmailAndPassword,
    doSignOut,
    doResetPassword,
    auth
}

export default firebase;