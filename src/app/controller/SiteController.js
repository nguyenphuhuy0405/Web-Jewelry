class SiteController {
    //[GET] /
    home(req, res) {
        res.send('Hello World')
    }
}

module.exports = new SiteController()
