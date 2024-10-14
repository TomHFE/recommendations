const VerifiedPassword = (password) => {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/;
    return passwordPattern.test(password);
}

export default VerifiedPassword;