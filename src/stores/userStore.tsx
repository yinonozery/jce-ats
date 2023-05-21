import { action, observable, makeAutoObservable } from 'mobx';
import type { UserInfo } from 'firebase/auth';

class UserStore {
    userInfo: UserInfo | null = null;

    constructor() {
        makeAutoObservable(this
            , {
                userInfo: observable,
                setUser: action.bound,
            });
    }

    setUser(user: UserInfo | null) {
        this.userInfo = user;
        if (user) {
            localStorage.setItem("userInfo", JSON.stringify(user))
        } else {
            localStorage.removeItem('userInfo');
            indexedDB.deleteDatabase('firebaser-heartbeat-database');
        }
    };

}

const userStore = new UserStore();
export default userStore;