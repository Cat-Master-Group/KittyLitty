const xss = require("xss");

const { checkId } = require("../../validations");
const {
  createUser,
  authUser,
  changeUser,
  removeUser,
  getSelectedUsers,
  canSwipe,
  swipe,
  getUser,
} = require("../../data/user.data");

const signUp = async (req, res, next) => {
  try {
    const userName = xss(req.body.userName);
    const email = xss(req.body.email);
    const password = xss(req.body.password);

    const oneUser = await createUser(userName, email, password);
    console.log(oneUser);
    res.json({ ...oneUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const signIn = async (req, res, next) => {
  try {
    const email = xss(req.body.email);
    const password = xss(req.body.password);
    const user = await authUser(email, password);
    console.log(user);
    if (user) {
      req.session.user = user;
      res.json({ login: "success" });
    } else {
      return res.json({ login: "fail" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const signOut = async (req, res, next) => {};

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
    const userInfo = await getUser(id);
    console.log(userInfo);
    return res.json(userInfo);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "User not found" });
  }
};

const adjustUser = async (req, res, next) => {
  try {
    const changeObj = {};
    for (let key in req.body) {
      changeObj[key] = xss(changeObj[key]);
    }
    console.log(req.body);
    const updatedUser = await changeUser(req.session.user, xss(req.body));
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
    await getUser(req.session.user._id);
  } catch (error) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const oneUser = removeUser(req.session.user._id);
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
    const list = await getSelectedUsers(currentUser);
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const swipeUser = async (req, res, next) => {
  try {
    const canItSwipe = canSwipe(req.session.user._id, xss(req.body.matchId));
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
    const result = swipe(_id, matchId);
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

//Add swipe function

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
};
