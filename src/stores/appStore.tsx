import { makeAutoObservable } from "mobx";

class appStore {
    isLoading: boolean = false;
    errorModalVisible: boolean = false;
    currPage: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    loadingHandler = (mode: boolean) => {
        this.isLoading = mode;
    };

    setCurrPage = (currPage: string | null) => {
        this.currPage = currPage;
    };

    setErrorModalVisible = (mode: boolean) => {
        this.errorModalVisible = mode;
    }

}

const appConfig = new appStore();

export default appConfig;
