// // Import the bcrypt library 
const bcrypt = require('bcrypt'); 
// Function to compare the plain password with the hashed password 
const verifyPassword = async (plainPassword, hashedPassword) => { 
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch
};

module.exports = verifyPassword