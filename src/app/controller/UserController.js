const User = require('../models/User')
class UserController {
    // [GET] /api/user/info
    async info(req, res) {
        try {
            //Get user by id
            const user = await User.findOne({ _id: req.user._id })

            return res.json({
                message: 'Get user info success',
                data: user,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    // [GET] /api/user/list
    async list(req, res) {
        try {
            //Get users
            const users = await User.find({}).lean()

            return res.json({
                message: 'Get user list success',
                data: users,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    // [PUT] /api/user/update
    async update(req, res) {
        const { name, address } = req.body
        try {
            //Update user by id
            await User.updateOne(
                {
                    _id: req.user._id,
                },
                {
                    name,
                    address,
                },
            )

            //Find new user by id
            const user = await User.findOne({ _id: req.user._id }).lean()
            return res.json({
                message: 'Update user success',
                data: {
                    name: user.name,
                    email: user.email,
                    address: user.address,
                    phoneNumber: user.phoneNumber,
                },
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    // [PUT] /api/user/change-password
    async changePassword(req, res) {
        try {
            const { password, newPassword } = req.body
            //Get user by id
            const user = await User.findOne({ _id: req.user._id })

            //Compare password
            const isCorrectPassword = await user.comparePassword(password)
            //If password is not correct return error message
            if (!isCorrectPassword)
                return res.status(400).json({
                    isLogin: false,
                    message: 'Password is not correct',
                })

            //Update user password
            user.password = newPassword
            //Save user in db
            await user.save()

            return res.status(200).json({
                message: 'Change user password success',
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    // [DELETE] /api/user/:id
    async delete(req, res) {
        //Get user by id
        const user = await User.findOne({ _id: req.params.id }).lean()

        //If user is not exist return error message
        if (!user)
            return res.status(404).json({
                message: 'User not found',
            })

        try {
            //Delete user by id
            await user.deleteOne({ _id: req.params.id }).lean()

            return res.json({
                message: 'Delete user success',
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }
}

module.exports = new UserController()
