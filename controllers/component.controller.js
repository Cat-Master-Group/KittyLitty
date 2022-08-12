module.exports = {
    async loadSignin(req, res, next) {
        res.render("components/signin", { layout: "component" });
    },

    async loadSignup(req, res, next) {
        res.render("components/signup", { layout: "component" });
    }
}