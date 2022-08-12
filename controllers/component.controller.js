module.exports = {
    loadSignin(req, res, next) {
        var renderData = {};
        renderData.layout = "component";
        res.render("components/signin", renderData);
    },

    loadSignup(req, res, next) {
        var renderData = {};
        renderData.layout = "component";
        res.render("components/signup", renderData);
    }
}