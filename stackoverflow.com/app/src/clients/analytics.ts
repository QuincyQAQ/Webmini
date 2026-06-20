export interface TrackingEvent {
    type: string;
    parameters: {
        [key: string]: string;
    };
}

export class TagClickedEvent implements TrackingEvent {
    type = "TagClicked";
    parameters: {
        source: string;
        tagName: string;
    };

    constructor(source: string, tagName: string) {
        this.parameters = {
            source,
            tagName
        };
    }
}

export class PopularUnansweredQuestionClickedEvent implements TrackingEvent {
    type = "PopularUnansweredQuestionClicked";
    parameters: {
        source: string;
        questionId: string;
    }

    constructor(questionId: number) {
        this.parameters = {
            source: window.location.href,
            questionId: questionId.toString(),
        }
    }
}

export function trackEvent(event: TrackingEvent): void {
    const payload = new Blob([JSON.stringify(event)], { type: "application/json" });

    const trackingUrl = `${import.meta.env.VITE_ROUTE_PREFIX ?? ""}/track`;

    navigator.sendBeacon(trackingUrl, payload);
}
