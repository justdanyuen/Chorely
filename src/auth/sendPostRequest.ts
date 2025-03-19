const API_BASE_URL = "http://localhost:3000"; // Ensure this matches your backend URL

interface PostPayload {
    [key: string]: any; // Allows for dynamic payload properties
}

export async function sendPostRequest<T = any>(endpoint: string, payload: PostPayload): Promise<Response> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        return response;
    } catch (error) {
        console.error("Error sending POST request:", error);
        throw error;
    }
}
