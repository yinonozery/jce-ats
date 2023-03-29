import { action, observable, makeAutoObservable } from 'mobx';
import type { UserInfo } from 'firebase/auth';

class UserStore {
    userInfo: UserInfo | null = null;

    constructor() {
        makeAutoObservable(this
            , {
                userInfo: observable,
                setUser: action,
            });
    }

    setUser(user: UserInfo | null) {
        if (user) {
            this.userInfo = user;
            localStorage.setItem("userInfo", JSON.stringify(user))
        } else {
            localStorage.removeItem('userInfo');
        }
    };

}

const userStore = new UserStore();
export default userStore;