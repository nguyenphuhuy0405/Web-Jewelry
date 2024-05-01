const jwt = require('jsonwebtoken')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const sendEmail = require('../../utils/sendEmail')
const crypto = require('crypto')
const { registerValidator } = require('../../validation/auth')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/GenerateToken')
require('dotenv').config()

class AuthController {
    //[POST] /api/auth/register
    async register(req, res) {
        //Check validator
        const { error } = registerValidator(req.body)
        const { name, email, password, address, phoneNumber } = req.body
        if (error)
            return res.status(400).json({
                message: error.details[0].message,
            })

        //Get email
        const isExistEmail = await User.findOne({ email }).lean()
        //If email is exist return error message
        if (isExistEmail)
            return res.status(400).json({
                message: 'Email is already exist',
            })

        //Get phone number
        const isExistPhoneNumber = await User.findOne({ phoneNumber })
        //If phone number is exist return error message
        if (isExistPhoneNumber) {
            return res.status(400).json({
                message: 'PhoneNumber is already exist',
            })
        }

        try {
            //Create new user
            const user = await User.create({
                name,
                email,
                password,
                address,
                phoneNumber,
            })

            return res.status(200).json({
                message: 'Register success',
                data: user,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    // [POST] /api/auth/login
    async login(req, res) {
        const { email, password } = req.body
        //Get user by email
        const user = await User.findOne({ email })
        //If user is not exist return error message
        if (!user)
            return res.status(400).json({
                isLogin: false,

                message: 'User is not exist',
            })

        //Compare password
        const isCorrectPassword = await user.comparePassword(password)
        //If password is not correct return error message
        if (!isCorrectPassword)
            return res.status(400).json({
                isLogin: false,

                message: 'Password is not correct',
            })

        try {
            //Create access token & refresh token
            const accessToken = generateAccessToken(user._id, user.role)
            const refreshToken = generateRefreshToken(user._id)

            //Save refresh token in database
            await User.updateOne(
                {
                    _id: user._id,
                },
                {
                    refreshToken: refreshToken,
                },
            )

            //Save refresh token in cookies
            res.cookie('refreshToken', refreshToken, {
                httpOnly: false,
                secure: false,
                maxAge: 30 * 24 * 60 * 60 * 100, // 30 days
            })

            console.log('accessToken:', accessToken)
            console.log('refreshToken:', refreshToken)

            //Get new user by id
            const newUser = await User.findOne({ _id: user._id }).lean()
            return res.json({
                accessToken: accessToken,
                isLogin: true,

                message: `${newUser.name} is login`,
                data: newUser,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    // [POST] /api/auth/token
    async refreshToken(req, res) {
        try {
            // Get refresh token from cookies
            const refreshToken = req.cookies?.refreshToken

            //If refresh token in cookies or cookies is not exist return error message
            if (!req.cookies?.refreshToken && !req.cookies)
                return res.status(401).json({
                    message: 'Refresh token not found',
                })

            // Verify refresh token
            const result = jwt.verify(refreshToken, process.env.TOKEN_SECRET)

            console.log('result: ', result)

            // Find user by id and refresh token
            const user = await User.findOne({
                _id: result._id,
                refreshToken: refreshToken,
            }).lean()

            //If user is not exist return error message
            if (!user)
                return res.status(401).json({
                    message: 'User not found',
                })

            return res.status(200).json({
                message: 'Refresh access token success',
                accessToken: generateAccessToken(user._id, user.role),
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    // [POST] /api/auth/logout
    async logout(req, res) {
        try {
            // Check refresh token
            if (!req.cookies.refreshToken && !req.cookies)
                return res.status(401).json({
                    message: 'Refresh token not found',
                })

            //Delete refresh token in database
            const user = await User.updateOne(
                {
                    refreshToken: req.cookies.refreshToken,
                },
                {
                    refreshToken: '',
                },
            )
            if (user.modifiedCount != 1) {
                return res.status(400).json({
                    message: 'Logout failed',
                })
            }

            // Destroy refresh token in cookies
            res.clearCookie('refreshToken'),
                {
                    httpOnly: true,
                    success: true,
                }

            return res.status(200).json({
                message: 'Logout success',
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[POST] /api/auth/password-reset
    async passwordResetLink(req, res) {
        try {
            const { email } = req.body
            //Get user by email
            const user = await User.findOne({ email })
            //If user is not exist return error message
            if (!user) {
                return res.status(404).json({
                    message: 'User not found',
                })
            }

            //Create reset token
            const resetToken = user.createPasswordResetToken()
            //Save reset token
            await user.save()

            //Link reset password
            const link = `<a href="${process.env.CLIENT_BASE_URL}/reset-password/${resetToken}">Click here</a>`
            //Text in email
            const text = 'Password reset link(expire in 15 minutes): ' + link
            //Send email to user
            await sendEmail(user.email, 'Password reset', text)

            return res.status(200).json({
                message: 'Password reset link sent to your email account',
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[POST] /api/auth/password-reset/:token
    async passwordReset(req, res) {
        const { password } = req.body
        //Create password reset token
        const passwordResetToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

        //Find user by passwordResetToken and passwordResetExpires > now
        const user = await User.findOne({
            passwordResetToken: passwordResetToken,
            passwordResetExpires: { $gt: Date.now() },
        })
        //If user is not exist return error message
        if (!user) {
            return res.status(400).json({
                message: 'Invalid link or expired',
            })
        }

        try {
            //Save password
            user.password = password
            // Delete reset token and expires
            user.passwordResetToken = undefined
            user.passwordResetExpires = undefined
            //Save user in db
            await user.save()

            return res.status(200).json({
                message: 'Password reset successfully',
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }
}

module.exports = new AuthController()
