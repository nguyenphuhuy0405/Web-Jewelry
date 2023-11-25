const fs = require('fs')

const convertImage = (file, type = 'base64') => {
    try {
        const img = fs.readFileSync(file.path)
        const encodeImage = img.toString(type)
        // Define a JSONobject for the image attributes for saving to database
        const finalImg = {
            contentType: file.mimetype,
            image: new Buffer(encodeImage, type),
        }
        return finalImg
    } catch (error) {
        return console.log('Convert Image Error: ' + error)
    }
}

module.exports = convertImage
