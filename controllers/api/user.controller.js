const xss = require("xss");
const {
  createUser,
  authUser,
  changeUser,
  removeUser,
  getUser,
} = require("../../data/user.data");
const { checkId } = require("../../validations");

const signUp = async (req, res, next) => {
  try {
    const userName = xss(req.body.userName);
    const email = xss(req.body.email);
    const password = xss(req.body.password);

    console.log(req.body);
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

const adjustUser = async (req, res, next) => {
  try {
    console.log(req.session);
    console.log(req.body);
    const updatedUser = changeUser(req.session.user, req.body);
    res.json(updatedUser);
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

module.exports = {
  signUp,
  signIn,
  signOut,
  adjustUser,
  sendLoginStatus,
  deleteUser,
};
