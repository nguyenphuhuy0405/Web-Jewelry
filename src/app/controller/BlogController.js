const Blog = require('../models/Blog')
const User = require('../models/User')

class BlogController {
    //[GET] /api/blog/:slug
    async info(req, res, next) {
        //Get blog by slug
        const blog = await Blog.findOne({ slug: req.params.slug })
        //If blog is not exist return error message
        if (!blog)
            return res.status(404).json({
                message: 'Blog is not exist',
            })

        try {
            //Increase number of views
            blog.numberViews += 1
            //Save blog in db
            await blog.save()

            return res.status(200).json({
                message: 'Get blog info success',
                data: blog,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[GET] /api/blog/
    async list(req, res, next) {
        try {
            //Get blogs
            let blogs = await Blog.find({})

            return res.status(200).json({
                message: 'Get list of blogs success',
                data: blogs,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[POST] /api/blog/
    async create(req, res, next) {
        const { title, content, image, author } = req.body
        //Get blog by title
        const blog = await Blog.findOne({ title }).lean()
        //If blog is exist return error message
        if (blog)
            return res.status(400).json({
                message: 'Blog title is exist',
            })

        try {
            //Create blog
            const newBlog = await Blog.create({
                title,
                content,
                image,
                author,
            })

            return res.status(200).json({
                message: 'Create blog success',
                data: newBlog,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[PUT] /api/blog/:id
    async update(req, res, next) {
        const { title, content, image, author } = req.body
        //Get blog by id
        const blog = await Blog.findOne({ _id: req.params.id }).lean()
        //If blog is not exist return error message
        if (!blog)
            return res.status(404).json({
                message: 'Blog is not exist',
            })
        try {
            //Update blog
            await Blog.updateOne(
                {
                    _id: req.params.id,
                },
                {
                    title,
                    content,
                    image,
                    author,
                },
            )

            //Find new blog by id
            const newBlog = await Blog.findOne({ _id: req.params.id }).lean()

            return res.status(200).json({
                message: 'Update blog success',
                data: blog,
                newData: newBlog,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[DELETE] /api/blog/:id
    async delete(req, res, next) {
        //Get blog by id
        const blog = await Blog.findOne({ _id: req.params.id }).lean()
        //If blog is not exist return error message
        if (!blog)
            return res.status(404).json({
                message: 'Blog is not exist',
            })

        try {
            //Delete blog by id
            await Blog.deleteOne({ _id: req.params.id })

            return res.status(200).json({
                message: 'Delete blog success',
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[POST] /api/blog/like/:id
    async like(req, res, next) {
        //Get user by id
        const user = await User.findOne({ _id: req.user._id })
        //Get blog by user id in liked
        const blog = await Blog.findOne({ liked: user._id })
        if (blog) {
            return res.status(404).json({
                message: 'Blog already is like',
            })
        }
        try {
            //Update blog by id
            await Blog.updateOne(
                {
                    _id: req.params.id,
                },
                {
                    $push: { liked: user._id }, //Push user id in liked in blog
                    $inc: { isLiked: 1 }, //Count number of liked
                },
            )

            //Get new blog
            const newBlog = await Blog.findOne({ _id: req.params.id })

            return res.status(200).json({
                message: 'Like blog success',
                data: newBlog,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[POST] /api/blog/unlike/:id
    async unlike(req, res, next) {
        //Get user by id
        const user = await User.findOne({ _id: req.user._id })
        //Get blog by user id in liked
        const blog = await Blog.findOne({ liked: user._id })
        if (!blog) {
            return res.status(404).json({
                message: 'Blog already is unlike',
            })
        }
        try {
            //Update blog by id
            await Blog.updateOne(
                {
                    _id: req.params.id,
                },
                {
                    $pull: { liked: user._id }, //Push user id in liked in blog
                    $inc: { isLiked: -1 }, //Count number of liked
                },
            )

            //Get new blog
            const newBlog = await Blog.findOne({ _id: req.params.id })

            return res.status(200).json({
                message: 'Unlike blog success',
                data: newBlog,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }
}

module.exports = new BlogController()
