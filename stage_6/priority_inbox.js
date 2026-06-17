const PRIORITY = {
    Placement: 3,
    Result: 2,
    Event: 1
};

function rankNotifications(notifications) {
    return notifications.sort((a, b) => {
        const priorityDifference =
            PRIORITY[b.Type] - PRIORITY[a.Type];

        if (priorityDifference !== 0) {
            return priorityDifference;
        }

        return (
            new Date(b.Timestamp) -
            new Date(a.Timestamp)
        );
    });
}

function getTopUnreadNotifications(
    notifications,
    limit = 10
) {
    const unreadNotifications =
        notifications.filter(
            notification =>
                notification.Read === false
        );

    const rankedNotifications =
        rankNotifications(
            unreadNotifications
        );

    return rankedNotifications.slice(
        0,
        limit
    );
}

const notifications = [
    {
        ID: "1",
        Type: "Result",
        Message: "Mid Semester Results Published",
        Timestamp: "2026-04-22 17:51:30",
        Read: false
    },
    {
        ID: "2",
        Type: "Placement",
        Message: "CSX Corporation Hiring Drive",
        Timestamp: "2026-04-22 17:51:18",
        Read: false
    },
    {
        ID: "3",
        Type: "Event",
        Message: "Farewell Celebration",
        Timestamp: "2026-04-22 17:51:06",
        Read: false
    },
    {
        ID: "4",
        Type: "Placement",
        Message: "Amazon Internship Opportunity",
        Timestamp: "2026-04-23 10:15:00",
        Read: false
    },
    {
        ID: "5",
        Type: "Result",
        Message: "Internal Assessment Marks Updated",
        Timestamp: "2026-04-23 09:00:00",
        Read: true
    }
];

const topNotifications =
    getTopUnreadNotifications(
        notifications,
        10
    );

console.log(
    "Top Unread Notifications:"
);

console.table(topNotifications);