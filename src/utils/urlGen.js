const chars = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890';

const urlGen = (length = 12) => {
    let url = "";

    for (let i = 0; i < length; i++) {
        url += chars[Math.floor(Math.random() * chars.length)];
    }
    return url;
}

module.exports = urlGen