module.exports = {
  loadSignin(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    renderData.axios = req.query.axios;
    renderData.componentname = "signin";
    renderData.script = true;
    res.render("components/signin", renderData);
  },

  loadSignup(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    renderData.axios = req.query.axios;
    renderData.componentname = "signup";
    renderData.script = true;
    res.render("components/signup", renderData);
  },

  loadSettings(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    renderData.axios = req.query.axios;
    renderData.componentname = "settings";
    renderData.script = true;
    res.render("components/settings", renderData);
  },

  //Swipe
  loadSwipe(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    renderData.axios = req.query.axios;
    renderData.componentname = "swipe";
    renderData.script = true;
    res.render("components/swipe", renderData);
  },
};
