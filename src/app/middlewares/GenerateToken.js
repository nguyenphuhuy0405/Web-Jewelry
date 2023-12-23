const jwt = require('jsonwebtoken')

// Generate access token
function generateAccessToken(userId, role) {
    return jwt.sign({ _id: userId, role: role }, process.env.TOKEN_SECRET, {
        expiresIn: '10s',
    }) //5 minutes
}

// Generate refresh token
function generateRefreshToken(userId) {
    return jwt.sign({ _id: userId }, process.env.TOKEN_SECRET, {
        expiresIn: '15s',
    }) //30 days
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
}
