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
    const { userName, email, password } = req.body;
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
    const { email, password } = req.body;
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

const isUser = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.json({ login: "fail" });
  }
};

const sendLoginStatus = async (req, res, next) => {
  res.json({ login: "success" });
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
  isUser,
  adjustUser,
  sendLoginStatus,
  deleteUser,
};
