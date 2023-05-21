import { action, makeAutoObservable, observable } from "mobx";

class appStore {
    isLoading: boolean;
    currPage: string | null;

    constructor() {
        makeAutoObservable(this, {
            isLoading: observable,
            currPage: observable,
            loadingHandler: action,
            setCurrPage: action,
        });
        this.isLoading = false;
        this.currPage = null;
    }

    loadingHandler = (mode: boolean) => {
        this.isLoading = mode;
    };

    setCurrPage = (currPage: string | null) => {
        this.currPage = currPage;
    };
}

const AppConfig = new appStore();

export default AppConfig;
