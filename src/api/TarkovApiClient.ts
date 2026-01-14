export const TARKOV_DEV_ENDPOINT = "https://api.tarkov.dev/graphql";

type GraphQLRepsonse<T> = {
    data: T;
    errors?: { message: string }[];
};

export async function tarkovDevQuery<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const response = await fetch(TARKOV_DEV_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
    });
    
    if (!response.ok) {
        throw new Error(`Network error: ${response.status} ${response.statusText}`);
    }
    const responseData: GraphQLRepsonse<T> = await response.json();

    if (responseData.errors && responseData.errors.length > 0) {
        const errorMessages = responseData.errors.map(err => err.message).join(", ");
        throw new Error(`GraphQL error: ${errorMessages}`);
    }
    if (!responseData.data) {
        throw new Error("No data received from API");
    }

    return responseData.data;
}