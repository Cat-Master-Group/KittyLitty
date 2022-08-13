const loadApp = async (req, res, next) => {
    res.render("app", { framename: "app", script: true });
}

module.exports = { loadApp };