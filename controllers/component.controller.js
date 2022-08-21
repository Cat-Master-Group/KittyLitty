const user = require("../data/user.data")


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

  loadCatInfo(req, res, next) {

    let id = req.params.id
    let userInfo = {}
    userInfo = user.getUser(id);

    const p = Promise.resolve(userInfo);

    p.then(value => {
      
      userInfo = value;
      const catInfo = userInfo.userCat;
      const renderData = {};
      renderData.layout = "component";
      renderData.axios = req.query.axios;
      renderData.componentname = "catInfo";
      renderData.script = true;
      renderData.catInfo = catInfo;
      res.render("components/catInfo", {renderData});
    })
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

  loadMessages(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    renderData.componentname = "messages";
    renderData.script = true;
    res.render("components/messages", renderData);
  },
};
