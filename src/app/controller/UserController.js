const User = require('../models/User')
class UserController {
    // [GET] /api/user/info
    async info(req, res) {
        try {
            //Get user by id
            const user = await User.findOne({ _id: req.user._id })
            if (!user) {
                return res.status(404).json({
                    message: 'User not found',
                })
            }

            return res.json({
                message: 'Get user info success',
                data: {
                    _id: user?._id,
                    name: user?.name,
                    address: user?.address,
                    phoneNumber: user?.phoneNumber,
                    role: user?.role,
                    email: user?.email,
                },
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
        const id = Number.parseInt(req.user._id)
        try {
            //Update user by id
            const user = await User.updateOne(
                {
                    _id: id,
                },
                {
                    name,
                    address,
                },
            )

            if (user.modifiedCount != 1) {
                return res.status(400).json({
                    message: 'Update user failed',
                })
            }

            //Find new user by id
            const updateUser = await User.findOne({ _id: id }).lean()
            return res.json({
                message: 'Update user success',
                data: {
                    _id: updateUser?._id,
                    name: updateUser?.name,
                    address: updateUser?.address,
                    phoneNumber: updateUser?.phoneNumber,
                    role: updateUser?.role,
                    email: updateUser?.email,
                },
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    // [PUT] /api/user/update/:id
    async updateInfo(req, res) {
        const { name, address } = req.body
        try {
            //Update user by id
            await User.updateOne(
                {
                    _id: req.params.id,
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
                data: user,
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
        const user = await User.findOne({ _id: req.params.id })

        //If user is not exist return error message
        if (!user)
            return res.status(404).json({
                message: 'User not found',
            })

        try {
            //Delete user by id
            await user.deleteOne({ _id: req.params.id })

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
