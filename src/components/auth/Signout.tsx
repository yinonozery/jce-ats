import firebase from "../../firebase/firebase"
import userStore from "../../stores/userStore";

const SignOut: React.FC = () => {
    if (window.confirm("Are you sure you want to log out?")) {
        firebase.doSignOut().then(() => {
            userStore.setUser(null);
            document.location.href = '/';
        });
    }
    return null
}

export default SignOut;