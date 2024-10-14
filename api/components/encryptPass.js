const bcrypt = require("bcrypt")

const hashpass = async (password) => {
    try {
        const hashpassword = await bcrypt.hash(password, 10)
        return (hashpassword)
    } catch (error) {
        console.log(`something went wrong ${error}`)
        return false
    }
}
module.exports = hashpass