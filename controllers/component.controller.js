module.exports = {
  loadSignin(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    res.render("components/signin", renderData);
  },

  loadSignup(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    res.render("components/signup", renderData);
  },

  loadSettings(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    res.render("components/settings", renderData);
  },
};
