function checkPassword(password, passwordConf) {
    if (password !== passwordConf) {
        return false;
    }
    return password.length >= 6;
}

export default checkPassword;