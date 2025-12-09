export const checkAbusiveText = async (text) => {
    const apiUrl = process.env.ABUSIVE_TEXT_PREDICTOR_API_URL;

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment: text }),
        });
        if (!response.ok) {
            throw new Error("Failed to fetch from abusive text predictor API");
        }

        const data = await response.json();
        return data.isToxic; // Assuming the API returns { isAbusive: true/false }

    } catch (error) {
        console.error("Error checking abusive text:", error);
        return false; // Assume non-abusive if API call fails
    }

}