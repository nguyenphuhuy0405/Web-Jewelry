const jwt = require('jsonwebtoken')

function VerifyToken(req, res, next) {
    try {
        //If access token not exist return error message
        if(!req?.headers?.authorization?.startsWith('Bearer')){
            return res.status(401).json({
                isSuccess: false,
                message: 'Required Access Token'
            })
        }else{

            //Get token
            const accessToken = req.headers['authorization'].split(' ')[1]
    
            jwt.verify(accessToken, process.env.TOKEN_SECRET, (err, decode) => {
                if (err)
                    return res.status(401).json({
                        isSuccess: false,
                        message: 'Invalid Access Token'
                    })
                console.log('decoded: ', decode)
                req.user = decode
                next()
            })
        }
    } catch (error) {
        return res.status(400).json({
            isSuccess: false,
            message: 'An error occured! ' + error
        })
    }
}

function isAdmin(req, res, next) {
    let isAdminRole = req.user.role === 'admin' ? true : false
    if (!isAdminRole) {
        return res.status(401).json({
            isSuccess: false,
            message: 'Required admin role'
        })
    }
    next()
}
module.exports = {
    VerifyToken,
    isAdmin
}
