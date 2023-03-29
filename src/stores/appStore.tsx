import { makeAutoObservable } from "mobx";

class appStore {
    isLoading: boolean;
    tempData: Array<any> | null;

    constructor() {
        makeAutoObservable(this);
        this.isLoading = false;
        this.tempData = null;
    }

    loadingHandler = (mode: boolean) => {
        this.isLoading = mode;
    }

    setTempData = (data: Array<any> | null) => {
        this.tempData = data;
    }

}
const AppConfig = new appStore();

export default AppConfig;