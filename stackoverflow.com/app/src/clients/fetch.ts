const createFetchWrapper = (baseURL: string) => {
    return (input: RequestInfo, init?: RequestInit): Promise<Response> => {
        const url = typeof input === "string" ? `${baseURL}${input}` : input;
        return fetch(url, init);
    };
};

export { createFetchWrapper }; // exporting only for testing purposes
export default createFetchWrapper(import.meta.env.VITE_ROUTE_PREFIX ?? "");
