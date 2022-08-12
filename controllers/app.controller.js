const loadApp = async (req, res, next) => {
    res.render("app");
}

module.exports = { loadApp };