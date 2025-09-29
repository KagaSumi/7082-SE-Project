class GenericHelper {
    // This function mimics the wait time when querying data from the DB
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    } 

    getCurrentDateTime() {
        const now = new Date();

        // Extract date components
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString(); // Months are 0-indexed
        const day = now.getDate().toString();

        // M/D/YYYY
        const formattedDateTime = `${month}/${day}/${year}`;

        return formattedDateTime;
    }
}

module.exports = new GenericHelper();