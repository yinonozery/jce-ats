import Candidate from "./Candidate";

type RelevantCandidate = {
    candidate: Candidate | undefined,
    keywordsMatches: string[],
    score: number,
}

export default RelevantCandidate;