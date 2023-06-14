import { makeAutoObservable, reaction } from "mobx";
import Candidate from "../components/types/Candidate";
import appConfig from "./appStore";
import Course from "../components/types/Course";
import EmailTemplate from "../components/types/EmailTemplate";
import userStore from "./userStore";

class DataStore {
    candidatesData: Candidate[] | undefined = undefined;
    coursesData: Course[] | undefined = undefined;
    keywordsData: {
        numOfResumes: number;
        currentDocStats: any;
    } | undefined = undefined;
    templatesData: EmailTemplate[] | undefined = undefined;
    templatesTypesData: string[] = [];
    lastCandidatesFetchTime: number = 0;
    lastCoursesFetchTime: number = 0;
    lastKeywordsFetchTime: number = 0;
    lastTemplatesFetchTime: number = 0;
    lastTemplatesTypesFetchTime: number = 0;
    waitingTime: number = 2 * 60 * 1000;

    constructor() {
        makeAutoObservable(this);

        // Reaction to changes in userStore's userInfo
        reaction(
            () => userStore.userInfo,
            (userInfo) => {
                if (userInfo?.uid) {
                    appConfig.loadingHandler(true)
                    const promises = [
                        this.fetchCandidatesData(true),
                        this.fetchCoursesData(true),
                        this.fetchKeywordsData(true),
                        this.fetchTemplatesData(true),
                        this.getTemplatesTypes(),
                    ]
                    Promise.all(promises).then(() => {
                        console.log("Data Loaded Successfully")
                        appConfig.loadingHandler(false)
                    })
                }
            }
        );
    }

    fetchCandidatesData = async (forceFetch: boolean) => {
        const currentTime = Date.now();
        const timeElapsed = currentTime - this.lastCandidatesFetchTime;

        if (
            !this.candidatesData ||
            forceFetch ||
            timeElapsed >= this.waitingTime
        ) {
            try {
                appConfig.loadingHandler(true);
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/candidates`);
                const data = await response.json();
                if (data.statusCode === 200) {
                    this.candidatesData = data.body;
                    this.lastCandidatesFetchTime = Date.now();
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                appConfig.setErrorModalVisible(true);
            } finally {
                appConfig.loadingHandler(false);
            }
        }
    };

    fetchCoursesData = async (forceFetch: boolean) => {
        const currentTime = Date.now();
        const timeElapsed = currentTime - this.lastCoursesFetchTime;

        if (
            !this.coursesData ||
            forceFetch ||
            timeElapsed >= this.waitingTime
        ) {
            try {
                appConfig.loadingHandler(true);
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/courses`);
                const data = await response.json();
                if (data.statusCode === 200) {
                    this.coursesData = data.body;
                    this.lastCoursesFetchTime = Date.now();
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                appConfig.setErrorModalVisible(true);
            } finally {
                appConfig.loadingHandler(false);
            }
        }
    };

    fetchKeywordsData = async (forceFetch: boolean) => {
        const currentTime = Date.now();
        const timeElapsed = currentTime - this.lastKeywordsFetchTime;

        if (
            !this.keywordsData ||
            forceFetch ||
            timeElapsed >= this.waitingTime
        ) {
            try {
                appConfig.loadingHandler(true);
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/keywords`);
                const data = await response.json();
                if (data.statusCode === 200) {
                    this.keywordsData = {
                        numOfResumes: data.numOfResumes,
                        currentDocStats: data.currentDocStats,
                    };
                    this.lastKeywordsFetchTime = Date.now();
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                appConfig.setErrorModalVisible(true);
            } finally {
                appConfig.loadingHandler(false);
            }
        }
    };

    fetchTemplatesData = async (forceFetch: boolean) => {
        const currentTime = Date.now();
        const timeElapsed = currentTime - this.lastTemplatesFetchTime;

        if (
            !this.templatesData ||
            forceFetch ||
            timeElapsed >= this.waitingTime
        ) {
            try {
                appConfig.loadingHandler(true);
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/email-templates`);
                const data = await response.json();
                if (data.statusCode === 200) {
                    this.templatesData = data.body;
                    this.lastTemplatesFetchTime = Date.now();
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                appConfig.setErrorModalVisible(true);
            } finally {
                appConfig.loadingHandler(false);
            }
        }
    };

    getTemplatesTypes = async () => {
        reaction(
            () => this.templatesData,
            () => {
                const set = new Set(this.templatesData?.map((item: EmailTemplate) => item.TemplateType))
                this.templatesTypesData = Array.from(set);
            })
    }
}

const dataStore = new DataStore();

export default dataStore;
