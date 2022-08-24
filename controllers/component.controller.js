const userdb = require("../data/user.data");
const { ObjectId } = require("mongodb");

module.exports = {
  loadSignin(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    renderData.ajax = req.query.ajax;
    renderData.componentname = "signin";
    renderData.script = true;
    renderData.css = true;
    res.render("components/signin", renderData);
  },

  loadSignup(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    renderData.ajax = req.query.ajax;
    renderData.componentname = "signup";
    renderData.script = true;
    renderData.css = true;
    res.render("components/signup", renderData);
  },

  loadHeaderMenu(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    renderData.ajax = req.query.ajax;
    renderData.componentname = "header-menu";
    renderData.script = true;
    renderData.css = true;
    res.render("components/header-menu", renderData);
  },

  loadFollowedList(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    renderData.ajax = req.query.ajax;
    renderData.componentname = "followed-list";
    renderData.script = true;
    renderData.css = true;

    const projection = {};
    projection.projection = {
      _id: true,
      userName: true,
    };

    userdb
      .getUserArray(req.session.user.followedUsers, projection)
      .then((followedUserList) => {
        renderData.followedUsers = [];
        if (followedUserList) {
          followedUserList.forEach((element) => {
            renderData.followedUsers.push({
              _id: element._id.toString(),
              userName: element.userName,
            });
          });
        }
        res.render("components/followed-list", renderData);
      });
  },

  loadSettings(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    renderData.ajax = req.query.ajax;
    renderData.componentname = "settings";
    renderData.script = true;

    renderData.userInfo = req.session.user;
    res.render("components/settings", renderData);
  },

  loadUserInfo(req, res, next) {
    let id = req.params.id;
    let userInfo = {};
    userInfo = userdb.getUser(id);

    const p = Promise.resolve(userInfo);

    p.then((value) => {
      userInfo = value;
      const renderData = {};
      renderData.layout = "component";
      renderData.ajax = req.query.ajax;
      renderData.componentname = "user-info";
      renderData.script = true;
      renderData.css = true;

      const commenterIdArray = [];
      const projection = {};
      projection.projection = {
        _id: true,
        userName: true,
      };

      try {
        userInfo.userComments.forEach((element) => {
          commenterIdArray.push(element.commenterId);
        });
      } catch (e) {
        console.log(e);
      }

      userdb.getUserArray(commenterIdArray, projection).then((commenterArray) => {
        const commenterNameMap = new Map(commenterArray.map((commenter) => {
          return [commenter._id.toString(), commenter.userName];
        }));

        const comments = [];

        try {
          userInfo.userComments.forEach((element) => {
            console.log(commenterNameMap);
            let likeSum = 0;
            element.likes.forEach((like) => {
              likeSum += Number(like.likeValue);
            });

            const userLikeValue = element.likes.find((like) => {
              return like.likerId === req.session.user._id.toString();
            });
            const commentObj = {
              commenterName: commenterNameMap.get(element.commenterId),
              commenterId: element.commenterId,
              commentText: element.commentText,
              commentLikeSum: likeSum,
              userLikeValue: userLikeValue ? userLikeValue : 0,
              isLikeActive: userLikeValue && userLikeValue.likeValue == Number(1) ? true : false,
              isDislikeActive: userLikeValue && userLikeValue.likeValue == Number(-1) ? true : false,
            }
            comments.push(commentObj);
          });
        } catch (e) {
          console.log(e);
        }

        renderData.catInfo = {};
        renderData.catInfo.catGallery = userInfo.userCat.catGallery;
        renderData.catInfo.catName = userInfo.userCat.catName;
        renderData.catInfo.catAgeMonths = userInfo.userCat.catAge
        renderData.catInfo.catAgeYears = Math.floor(renderData.catInfo.catAgeMonths / 12);
        renderData.catInfo.catAgeMonths = renderData.catInfo.catAgeMonths % 12;
        renderData.catInfo.catGender = userInfo.userCat.catGender;
        renderData.catInfo.catIsAltered = userInfo.userCat.catIsAltered;

        renderData.userBio = userInfo.userBio;
        renderData.id = userInfo._id.toString();

        renderData.isCurrentUser = userInfo._id.toString() === req.session.user._id.toString();
        renderData.comments = comments;
        renderData.hasComments = comments.length > 0;
        res.render("components/user-info", renderData);
      });
    });
  },

  //Swipe
  loadAvailable(req, res, next) {
    const renderData = {};
    renderData.layout = "component";
    renderData.ajax = req.query.ajax;
    renderData.componentname = "available";
    renderData.script = true;
    renderData.css = true;
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
