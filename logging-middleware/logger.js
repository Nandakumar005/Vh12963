const LOG_API =
    "http://4.224.186.213/evaluation-service/logs";

async function Log(
    stack,
    level,
    packageName,
    message,
    accessToken
) {
    try {
        const response = await fetch(LOG_API, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                stack,
                level,
                package: packageName,
                message
            })
        });

        const data = await response.json();

        return data;
    } catch (error) {
        throw new Error(
            `Logging failed: ${error.message}`
        );
    }
}

module.exports = Log;