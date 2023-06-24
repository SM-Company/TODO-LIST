export const getCurrentTime = () => {
    const now = new Date();
    const options = {
        timeZone: "America/Santo_Domingo",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    };
    return now.toLocaleString("en-US", options);
};