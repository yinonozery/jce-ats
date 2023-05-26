import { makeAutoObservable, reaction } from "mobx";
import Candidate from "../components/types/Candidate";
import AppConfig from "./appStore";
import Course from "../components/types/Course";
import EmailTemplate from "../components/types/EmailTemplates";
import userStore from "./userStore";

class DataStore {
    candidatesData: Candidate[] | undefined = undefined;
    coursesData: Course[] | undefined = undefined;
    keywordsData: {
        currentKeywords: string[];
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
                    this.fetchCandidatesData(false);
                    this.fetchCoursesData(false);
                    this.fetchKeywordsData(false);
                    this.fetchTemplatesData(false);
                    this.getTemplatesTypes();
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
                console.log("Fetching candidates data...");
                AppConfig.loadingHandler(true);
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/jce/candidates`);
                const data = await response.json();
                if (data.statusCode === 200) {
                    this.candidatesData = data.body;
                    this.lastCandidatesFetchTime = Date.now();
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                AppConfig.loadingHandler(false);
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
                console.log("Fetching courses data...");
                AppConfig.loadingHandler(true);
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/jce/courses`);
                const data = await response.json();
                if (data.statusCode === 200) {
                    this.coursesData = data.body;
                    this.lastCoursesFetchTime = Date.now();
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                AppConfig.loadingHandler(false);
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
                console.log("Fetching keywords data...");
                AppConfig.loadingHandler(true);
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/jce/keywords`);
                const data = await response.json();
                if (data.statusCode === 200) {
                    this.keywordsData = {
                        currentKeywords: data.currentKeywords,
                        numOfResumes: data.numOfResumes,
                        currentDocStats: data.currentDocStats,
                    };
                    this.lastKeywordsFetchTime = Date.now();
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                AppConfig.loadingHandler(false);
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
                console.log("Fetching email templates data...");
                AppConfig.loadingHandler(true);
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/jce/email-templates`);
                const data = await response.json();
                if (data.statusCode === 200) {
                    this.templatesData = data.body;
                    this.lastTemplatesFetchTime = Date.now();
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                AppConfig.loadingHandler(false);
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
