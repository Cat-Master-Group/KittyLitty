const xss = require("xss");

const { checkId, checkString } = require("../../validations");
const userdb = require("../../data/user.data");
const e = require("express");

const signUp = async (req, res, next) => {
  const payload = {};

  try {
    payload.userName = xss(req.body.userName);
    payload.email = xss(req.body.email);
    payload.password = xss(req.body.password);
    payload.userCat = {};
    payload.userCat.catName = xss(req.body.userCat.catName);
    payload.userCat.catGender = xss(req.body.userCat.catGender);
    payload.userCat.catAge = xss(req.body.userCat.catAge);
    payload.userCat.catBreed = xss(req.body.userCat.catBreed);
    payload.userCat.catIsAltered = xss(req.body.userCat.catIsAltered);
    payload.userCat.catGallery = [];
    req.body.userCat.catGallery.forEach((element) => {
      payload.userCat.catGallery.push(xss(element));
    });
    payload.userBio = req.body.userBio;
    checkString(payload.userName);
    checkString(payload.email);
    checkString(payload.userCat.catName);
    checkString(payload.userCat.catGender);
    checkString(payload.userCat.catBreed);
    checkString(payload.userCat.catIsAltered);
    checkString(payload.userBio);
    const checkDup = await userdb.findDuplicateEmail(payload.email);
    console.log("AHH", checkDup);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error, message: "Invalid input" });
  }

  try {
    const oneUser = await userdb.createUser(payload);
    console.log(oneUser);
    req.session.user = oneUser;
    return res.json({ login: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

const signIn = async (req, res, next) => {
  try {
    console.log(req.body);
    const email = xss(req.body.email);
    try {
      checkString(email);
    } catch (e) {
      res.status(400).json({ email: "No email provided" });
      return;
    }
    if (email.length < 3 || email.length > 255) {
      res.status(400).json({ email: "Invalid email length" });
      return;
    }
    if (
      !email.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      res.status(400).json({ email: "Invalid email format." });
      return;
    }
    const password = xss(req.body.password);
    try {
      checkString(password)
    } catch (e) {
      res.status(400).json({ errorMessage: "No password provided" });
      return;
    }
    if (password.length < 8) {
      res
        .status(400)
        .json({ errorMessage: "Password must be at least 8 characters long" });
      return;
    }
    console.log("email: " + email);
    console.log("password: " + password);
    const user = await userdb.authUser(email, password);
    console.log(user);
    if (user) {
      req.session.user = user;
      res.json({ login: "success" });
    } else {
      res.status(400).json({ login: "fail" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const signOut = async (req, res, next) => {
  req.session.destroy();
  res.json({ logout: "success" });
};

const sendLoginStatus = async (req, res, next) => {
  if (req.session.user) {
    res.json({ login: "success" });
  } else {
    res.json({ login: "fail" });
  }
};

const getUserInfo = async (req, res, next) => {
  const id = xss(req.params.id);

  try {
    checkId(id, "_id");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Id of user cannot be validated!" });
  }

  try {
    const userInfo = await userdb.getUser(id);
    console.log(userInfo);
    return res.json(userInfo);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "User not found" });
  }
};

const getUserSettingInfo = async (req, res, next) => {
  try {
    const userInfo = await getUser(req.session.user._id);
    delete userInfo.password;
    delete userInfo.email;
    res.json(userInfo);
  } catch (error) {
    res
      .status(403)
      .json({ error, message: "Not allowed to access the user info!" });
  }
};

const adjustUser = async (req, res, next) => {
  try {
    const { payLoad } = JSON.parse(req.body.json);
    const changeObj = {};
    for (let key in payLoad) {
      changeObj[key] = xss(payLoad[key]);
    }
    const updatedUser = await userdb.changeUser(req.session.user, changeObj);
    delete updatedUser.email;
    delete updatedUser.password;
    console.log(updatedUser);
    return res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    checkId(req.session.user._id, "_id");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Id of user cannot be validated!" });
  }

  try {
    await userdb.getUser(req.session.user._id);
  } catch (error) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const oneUser = userdb.removeUser(req.session.user._id);
    if (oneUser) {
      req.session.destroy();
      return res.json({ deleted: true });
    }
    throw "User was unsuccessfully deleted!";
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const availableUsers = async (req, res, next) => {
  try {
    const currentUser = req.session.user._id;
    const list = await userdb.getSelectedUsers(currentUser);
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const swipeUser = async (req, res, next) => {
  try {
    const canItSwipe = userdb.canSwipe(
      req.session.user._id,
      xss(req.body.matchId)
    );
    const matchId = xss(req.body.matchId);
    //check to see if it's a real ID
    if (!matchId) {
      throw "Not a real ID";
    }
    //check to see if the swipe user cannot swipe itself(not the same id)
    //for example:
    if (!canItSwipe) {
      throw "Cannot Match";
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "User cannot match with this person" });
  }
  try {
    const { _id } = req.session.user;
    const matchId = xss(req.body.matchId);
    const result = await userdb.swipe(_id, matchId);
    req.session.user = await userdb.getUser(_id);
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

const reportUser = async (req, res, next) => {
  const details = xss(req.body.details);
  const offendedId = xss(req.body.offendedId);
  const reason = xss(req.body.reason);
  const id = xss(req.session.user._id);
  try {
    if (offendedId === id) {
      throw "cannot report yourself";
    }
    checkId(id, "id");
    checkId(offendedId, "offendedId");
    checkString(reason, "reason");
    checkString(details, "details");
    if (reason !== "fake" && reason !== "spam" && reason !== "harrass") {
      throw "Please choose a selected reason";
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error, message: "Invalid input" });
  }
  try {
    await userdb.getUser(id);
    await userdb.getUser(offendedId);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error, message: "Could not find user" });
  }

  try {
    await userdb.reportOneUser(id, offendedId, reason, details);
    return res.json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "fail" });
  }
};

const getCurrentUserId = (req, res, next) => {
  res.json(req.session.user._id);
};

//Add swipe function

const addComment = async (req, res, next) => {
  const apiSession = {};

  try {
    const commentTargetId = xss(req.body.commentTargetId.trim());
    const commentObj = {
      commenterId: req.session.user._id,
      commentText: xss(req.body.commentText.trim()),
      likes: [{
        likerId: req.session.user._id,
        likeValue: 1
      }],
    };
    apiSession.commentTargetId = commentTargetId;
    apiSession.commentObj = commentObj;
  } catch (e) {
    res.status(400).json({ e, message: "Invalid input" });
    return;
  }

  try {
    await userdb.addComment(apiSession.commentTargetId, apiSession.commentObj);
    return res.json({ message: "success" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ e, message: "fail" });
    return;
  }
};

const likeComment = async (req, res, next) => {
  const apiSession = {};
  try {
    const commentTargetId = xss(req.body.commentTargetId.trim());
    const commentIndex = xss(req.body.commentIndex);
    const likeObj = {
      likerId: req.session.user._id,
      likeValue: xss(req.body.likeValue),
    };
    apiSession.commentTargetId = commentTargetId;
    apiSession.commentIndex = commentIndex;
    apiSession.likeObj = likeObj;
  } catch (e) {
    res.status(400).json({ e, message: "Invalid input" });
    return;
  }

  try {
    await userdb.likeComment(apiSession.commentTargetId, apiSession.commentIndex, apiSession.likeObj);
    res.json({ message: "success" });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ e, message: "fail" });
    return;
  }
}

module.exports = {
  signUp,
  signIn,
  signOut,
  adjustUser,
  sendLoginStatus,
  deleteUser,
  availableUsers,
  swipeUser,
  getUserInfo,
  getCurrentUserId,
  addComment,
  getUserSettingInfo,
  reportUser,
  likeComment,
};
