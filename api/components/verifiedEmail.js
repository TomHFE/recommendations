function verify (email) {
        // regexp to check for @ etc
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailPattern.test(email);
}

module.exports = verify