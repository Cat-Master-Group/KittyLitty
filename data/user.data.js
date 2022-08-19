const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const mongoCollections = require("../config/mongoCollections");
const e = require("express");
const { users } = mongoCollections;
const saltRounds = 16;

const createUser = async (userName, email, unHashedPassword) => {
  if (!userName || !email || !unHashedPassword) {
    throw "signIn incomplete";
  }

  const userCollection = await users();

  const password = await bcrypt.hash(unHashedPassword, saltRounds);

  const payLoad = {
    userName,
    password,
    email,
  };
  const oneUser = await userCollection.insertOne(payLoad);
  if (oneUser.insertedCount === 0) {
    throw "Insert failed!";
  }
  return await getUser(oneUser.insertedId.toString());
};

const getUser = async (id) => {
  const userCollection = await users();
  const oneUser = await userCollection.findOne({ _id: ObjectId(id) });
  if (!oneUser) {
    throw "User not found";
  }
  return oneUser;
};

const getAllUser = async () => {
  const userCollection = await users();
  const allUsers = await userCollection.findAll();
  return allUsers;
};

const authUser = async (email, password) => {
  if (!email || !password) {
    throw "incomplete login";
  }
  const userCollection = await users();
  const oneUser = await userCollection.findOne({ email });
  if (!oneUser) {
    return false;
  }

  const correctPassword = await bcrypt.compare(password, oneUser.password);

  if (correctPassword) {
    return oneUser;
  } else {
    return false;
  }
};

const changeUser = async (user, changeObj) => {
  const payload = {};
  if (changeObj.catGender) {
    payload.catGender = changeObj.catGender;
  }
  if (changeObj.catAge) {
    payload.catAge = changeObj.catAge;
  }
  if (changeObj.catBreed) {
    payload.catBreed = changeObj.catBreed;
  }
  if (changeObj.catIsAltered) {
    payload.catIsAltered = changeObj.catIsAltered;
  }
  if (changeObj.userBio) {
    payload.userBio = changeObj.userBio;
  }

  const userCollection = await users();
  const changedUser = await userCollection.updateOne(
    {
      _id: ObjectId(user.id),
    },
    { $set: payload }
  );
  if (!changedUser.matchedCount && !changedUser.modifiedCount) {
    throw "Update failed";
  }
  return await getUser(id);
};

const getSelectedUsers = async (id) => {
  const userCollection = await users();
  console.log(id);
  const curUser = await getUser(id);
  // console.log(curUser);
  let blackList = [ObjectId(id)];
  if (curUser.followedUsers) {
    curUser.followedUsers = curUser.followedUsers.map((x) => ObjectId(x));
    console.log(curUser.followedUsers);
    blackList = [...curUser.followedUsers, ...blackList];
  }
  if (curUser.friendedUsers) {
    curUser.friendedUsers = curUser.friendedUsers.map((x) => ObjectId(x));
    blackList = [...curUser.friendedUsers, ...blackList];
  }
  if (curUser.blockedUsers) {
    curUser.blockedUsers = curUser.blockedUsers.map((x) => ObjectId(x));
    blackList = [...curUser.blockedUsers, ...blackList];
  }
  const selectedUsers = await userCollection
    .find(
      {
        _id: {
          $nin: blackList,
        },
        followedUsers: {
          $nin: [ObjectId(id)],
        },
        blockedUsers: {
          $nin: [ObjectId(id)],
        },
      },
      {
        projection: {
          _id: true,
        },
      }
    )
    .toArray();

  console.log(selectedUsers);
  return selectedUsers;
};
const alreadySeen = (personA, personBId, key) => {
  if (personA[key]) {
    const index = personA[key].indexOf(ObjectId(personBId));
    if (index >= 0) {
      return true;
    }
    return false;
  }
};
const canSwipe = async (id, matchId) => {
  if (id === matchId) {
    throw "Cannot match with yourself!";
  }
  checkId(id, "id");
  checkId(matchId, "matchId");
  const userCollection = await users();
  const curUser = await getUser(id);
  const matchUser = await getUser(matchId);

  if (curUser.followedUsers) {
    const index = curUser.followedUsers.indexOf(ObjectId(matchId));
    if (index >= 0) {
      throw `${curUser.userName} is already following ${matchUser.userName}`;
    }
  }
  const userFollow = alreadySeen(curUser, matchId, "friendedUsers");
  const matchFollow = alreadySeen(matchUser, id, "friendedUsers");
  const userBlock = alreadySeen(curUser, matchId, "blockedUsers");
  const matchBlock = alreadySeen(matchUser, id, "blockedUsers");

  if (userFollow || matchFollow || userBlock || matchBlock) {
    throw "Cannot match!";
  }
};

const swipe = async (id, matchId) => {
  const userCollection = await users();
  const curUser = await getUser(id);
  const matchUser = await getUser(matchId);
  let curList = [];
  if (
    matchUser.followedUsers &&
    matchUser.followedUsers.indexOf(ObjectId(id)) >= 0
  ) {
    if (curUser.friendedUsers) {
      curList = [...curUser.friendedUsers];
    }
    let matchList = [];
    if (matchUser.friendedUsers) {
      matchList = [...matchUser.friendedUsers];
    }
    curList.push(ObjectId(id));
    matchList.push(ObjectId(id));

    const matchFollowListIndex = matchUser.followedUsers.indexOf(ObjectId(id));
    const matchFollow = matchUser.followedUsers.splice(matchFollowListIndex);

    const updateCurUser = userCollection.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: { friendedUsers: curList } }
    );

    const updateMatchUser = userCollection.findOneAndUpdate(
      { _id: ObjectId(matchId) },
      { $set: { friendedUsers: matchList, followedUsers: matchFollow } }
    );

    if (!updateCurUser || !updateMatchUser) {
      throw "Match unsuccessful!";
    }
    return updateCurUser, updateMatchUser;
  } else {
    if (curUser.followedUsers) {
      curList = [...curUser.followedUsers];
    }
    curList.push(ObjectId(matchId));
    const updateCurUser = userCollection.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: { followedUsers: curList } }
    );

    if (!updateCurUser) {
      throw "Match unsuccessful!";
    }
    return [updateCurUser];
  }
};

const checkId = (id, varName) => {
  if (!id) {
    throw `Error: You must provide a ${varName}`;
  }
  if (typeof id !== "string") {
    throw `Error:${varName} must be a string`;
  }
  id = id.trim();
  if (id.length === 0) {
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  }
  if (!ObjectId.isValid(id)) {
    throw `Error: ${varName} invalid object ID`;
  }
  return id;
};

const removeUser = async (id) => {
  const userCollection = await users();
  const deletedUser = userCollection.deleteOne({
    _id: ObjectId(id),
  });
  if (deletedUser.deletedCount === 0) {
    throw `Could not delete user with id of ${id}`;
  }
  return true;
};

module.exports = {
  createUser,
  authUser,
  changeUser,
  getSelectedUsers,
  canSwipe,
  swipe,
  removeUser,
};
