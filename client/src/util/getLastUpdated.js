const getLastUpdated = (last_update) => {
    const updatedTime = new Date(last_update).getTime();
    const currentTime = Date.now();
    const difference = currentTime - updatedTime;

    //before 1 minutes
    if (difference < 60000) return ` ${Math.floor(difference / 1000)} seconds ago`;

    //before 1 hour
    if (difference < 3600000) return ` ${Math.floor(difference / 60000)} minutes ago`;

    //before 1 day
    if (difference < 86400000) return ` ${Math.floor(difference / 3600000)} hours ago`;

    //before 3 days
    if (difference < 259200000) return `${Math.floor(difference / 86400000)} days ago`;

    //default
    return ` on ${new Date(updatedTime).toISOString().split('T')[0]}`;
};

export default getLastUpdated;
