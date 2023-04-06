import { initializeApp } from "firebase/app";
import { setPersistence, getAuth, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, browserSessionPersistence, updateProfile, updateEmail, updatePassword } from "firebase/auth";
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

const doUpdateProfile = async (displayName: string, email: string) => {
    try {
        if (!displayName || !email)
            throw new Error('Both name and email are required to update profile');

        if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
                displayName: displayName
            });
            if (auth.currentUser.email !== email)
                await updateEmail(auth.currentUser, email);
        }
    } catch (error) {
        throw error;
    }
};

const doChangePassword = async (newPassword: string) => {
    try {
        if (!newPassword || newPassword.length < 1)
            throw new Error('Please enter password and try again');
        if (auth.currentUser)
            await updatePassword(auth.currentUser, newPassword);
    } catch (error) {
        throw error;
    }
};

// Export firebase methods
const firebase = {
    doSignInWithEmailAndPassword,
    doSignOut,
    doResetPassword,
    doUpdateProfile,
    doChangePassword,
    auth
}

export default firebase;