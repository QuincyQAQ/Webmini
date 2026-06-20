import fetch from "./fetch";
import PopularUnansweredQuestion from "../components/PopularUnansweredQuestion.svelte";

export type Heartbeat = {
    numberOfQuestionsAnswered: number;
    numberOfQuestionsAsked: number;
    numberOfCommentsPosted: number;
    numberOfSuccessfulUpvotes: number;
    numberOfUsersActive: number;
    popularUnansweredQuestion: PopularUnansweredQuestion | null;
    popularTags: string[] | null;
}


const getHeartbeat = async (timeFrame: string | undefined): Promise<Heartbeat> => {
    let url = "/heartbeat/data";

    if (timeFrame) {
        url += "?timeFrame=" + timeFrame;
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    // We expect at least some non-zero numers. If everything is zero,
    // something must have happened on the data side, so we throw an error
    // so the UI can handle it gracefully.
    const data = await response.json() as Heartbeat;

    if (data.numberOfUsersActive === 0 &&
        data.numberOfQuestionsAsked === 0 &&
        data.numberOfQuestionsAnswered === 0 &&
        data.numberOfCommentsPosted === 0 &&
        data.numberOfSuccessfulUpvotes === 0) {
        throw new Error("No activity data available");
    }

    return data;
}

export default {
    getHeartbeat,
};
