const multer = require('multer')
const path = require('path')
const ext = 'png'

//Set storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext)
    },
})

const upload = multer({ storage: storage })

module.exports = {
    upload,
}
