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
  available(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    renderData.axios = req.query.axios;
    renderData.componentname = "available";
    renderData.script = true;
    res.render("components/available", renderData);
  },

  //Report?
  available(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    renderData.axios = req.query.axios;
    renderData.componentname = "report";
    renderData.script = true;
    res.render("components/report", renderData);
  },
};
