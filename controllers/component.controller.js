const userdb = require("../data/user.data")


module.exports = {
  loadSignin(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    renderData.ajax = req.query.ajax;
    renderData.componentname = "signin";
    renderData.script = true;
    res.render("components/signin", renderData);
  },

  loadSignup(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    renderData.ajax = req.query.ajax
    renderData.componentname = "signup";
    renderData.script = true;
    res.render("components/signup", renderData);
  },

  loadHeaderMenu(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    renderData.ajax = req.query.ajax
    renderData.componentname = "header-menu";
    renderData.script = true;
    res.render("components/header-menu", renderData);
  },

  loadFollowedList(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    renderData.ajax = req.query.ajax
    renderData.componentname = "followed-list";
    renderData.script = true;

    const projection = {};
    projection.projection = {
      _id: true,
      userName: true,
    }

    userdb.getUserArray(req.session.user.followedUsers, projection).then((followedUserList) => {
      renderData.followedUsers = [];
      if (followedUserList) {
        followedUserList.forEach(element => {
          renderData.followedUsers.push({ _id: element._id.toString(), userName: element.userName });
        });
      }
      res.render("components/followed-list", renderData);
    });
  },

  loadSettings(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    renderData.ajax = req.query.ajax
    renderData.componentname = "settings";
    renderData.script = true;
    res.render("components/settings", renderData);
  },

  loadCatInfo(req, res, next) {
    let id = req.params.id;
    let userInfo = {};
    userInfo = userdb.getUser(id);

    const p = Promise.resolve(userInfo);

    p.then(value => {

      userInfo = value;
      const catInfo = userInfo.userCat;
      console.log(catInfo);
      const renderData = {};
      renderData.layout = "component";
      renderData.ajax = req.query.ajax;
      renderData.componentname = "cat-info";
      renderData.script = false;
      renderData.catInfo = catInfo;
      res.render("components/cat-info", renderData);
    })
  },

  //Swipe
  loadAvailable(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    renderData.ajax = req.query.ajax
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
