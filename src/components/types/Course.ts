import type Keyword from "./Keyword";

type Course = {
    name: string,
    keywords: Keyword[],
    key: number,
}

export default Course;