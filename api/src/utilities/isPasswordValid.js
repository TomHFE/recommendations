const isPasswordValid = (password) => {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/;
    return passwordPattern.test(password);
}

module.exports = isPasswordValid;