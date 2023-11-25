const multer = require('multer')
const fs = require('fs')

//Set storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/img')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    },
})

const upload = multer({ storage: storage })

module.exports = {
    upload,
}
