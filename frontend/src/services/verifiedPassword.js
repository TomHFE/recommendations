const verifiedPassword = (password) => {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/;
    return passwordPattern.test(password);
}

export default verifiedPassword;