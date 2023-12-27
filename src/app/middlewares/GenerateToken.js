const jwt = require('jsonwebtoken')

// Generate access token
function generateAccessToken(userId, role) {
    return jwt.sign({ _id: userId, role: role }, process.env.TOKEN_SECRET, {
        expiresIn: '1d',
    }) //5 minutes
}

// Generate refresh token
function generateRefreshToken(userId) {
    return jwt.sign({ _id: userId }, process.env.TOKEN_SECRET, {
        expiresIn: '30d',
    }) //30 days
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
}
