const sendResponse = (status, data = null, message = "", error = null) => {
    return {
        status,
        data,
        message,
        error
    };
};

module.exports = {
    sendResponse
};

