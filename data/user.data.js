const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const mongoCollections = require("../config/mongoCollections");
const { checkId } = require("../validations");
const { createConversation } = require("./conversations.data");
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

  // console.log("ALL USERS HERE", await userCollection.find({}).toArray());
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
  const userCollection = await users();
  userCollection.createIndex({ userLocation: "2dsphere" });
  const currentUser = await getUser(user._id);
  let updateChanges = currentUser;
  if (!updateChanges.userCat) {
    updateChanges.userCat = {};
  }
  if (typeof changeObj.userLocation === "string") {
    changeObj.userLocation = changeObj.userLocation.split(",");
    changeObj.userLocation[0] = Number(changeObj.userLocation[0]);
    changeObj.userLocation[1] = Number(changeObj.userLocation[1]);
  }

  if (changeObj.catName) {
    updateChanges.userCat.catName = changeObj.catName;
  }
  if (changeObj.catGender) {
    updateChanges.userCat.catGender = changeObj.catGender;
  }
  if (changeObj.catAge && Number(changeObj.catAge)) {
    updateChanges.userCat.catAge = Number(changeObj.catAge);
  }
  if (changeObj.catBreed) {
    updateChanges.userCat.catBreed = changeObj.catBreed;
  }
  if (changeObj.catIsAltered) {
    updateChanges.userCat.catIsAltered = changeObj.catIsAltered;
  }
  if (changeObj.userBio) {
    updateChanges.userBio = changeObj.userBio;
  }
  if (
    changeObj.userLocation &&
    changeObj.userLocation.length === 2 &&
    changeObj.userLocation[0] !== NaN &&
    changeObj.userLocation[1] !== NaN
  ) {
    updateChanges.userLocation = {
      type: "Point",
      coordinates: [0, 0],
    };
  }
  if (changeObj.filterMiles && Number(changeObj.filterMiles)) {
    updateChanges.filterMiles = Number(changeObj.filterMiles);
  }

  const changedUser = await userCollection.updateOne(
    {
      _id: ObjectId(user._id),
    },
    { $set: updateChanges }
  );
  if (!changedUser.matchedCount && !changedUser.modifiedCount) {
    throw "Update failed";
  }

  return await getUser(user._id);
};

const getSelectedUsers = async (id) => {
  const userCollection = await users();
  userCollection.createIndex({ userLocation: "2dsphere" });
  const curUser = await getUser(id);

  // let filterMiles = 100000;
  let coord;

  if (curUser.filterMiles) {
    filterMiles = curUser.filterMiles;
  }
  if (curUser.userLocation) {
    coord = curUser.userLocation.coordinates;
  }

  let blackList = [ObjectId(id)];
  if (curUser.followedUsers) {
    curUser.followedUsers = curUser.followedUsers.map((x) => ObjectId(x));
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
        friendedUsers: {
          $nin: [ObjectId(id)],
        },
        blockedUsers: {
          $nin: [ObjectId(id)],
        },
        userLocation: {
          $near: {
            $geometry: { type: "Point", coordinates: coord },
            $minDistance: 0,
            $maxDistance: filterMiles,
          },
        },
      },
      {
        projection: {
          _id: true,
        },
      }
    )
    .toArray();
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
  return true;
};

const swipe = async (id, matchId) => {
  const userCollection = await users();
  const curUser = await getUser(id);
  const matchUser = await getUser(matchId);

  let inMatchFollowerList = false;
  if (matchUser.followedUsers && matchUser.followedUsers.length > 0) {
    for (let i = 0; i < matchUser.followedUsers.length; i++) {
      const curFollower = matchUser.followedUsers[i].toString();
      if (curFollower === id) {
        inMatchFollowerList = true;
        break;
      }
    }
  }

  if (inMatchFollowerList) {
    let userFriendList = [];
    if (curUser.friendedUsers) {
      userFriendList = [...curUser.friendedUsers];
    }
    let matchFriendList = [];
    if (matchUser.friendedUsers) {
      matchFriendList = [...matchUser.friendedUsers];
    }
    userFriendList.push(ObjectId(matchId));
    matchFriendList.push(ObjectId(id));

    const matchFollowListIndex = matchUser.followedUsers.indexOf(ObjectId(id));
    matchUser.followedUsers.splice(matchFollowListIndex);

    const updateCurUser = await userCollection.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: { friendedUsers: userFriendList } }
    );

    const updateMatchUser = await userCollection.findOneAndUpdate(
      { _id: ObjectId(matchId) },
      {
        $set: {
          friendedUsers: matchFriendList,
          followedUsers: matchUser.followedUsers,
        },
      }
    );

    if (!updateCurUser || !updateMatchUser) {
      throw "Match unsuccessful!";
    }
    await createConversation([id, matchId]);
    return [updateCurUser, updateMatchUser];
  } else {
    let curFollowerList = [];
    if (curUser.followedUsers) {
      curFollowerList = [...curUser.followedUsers];
    }
    curFollowerList.push(ObjectId(matchId));
    const updateCurUser = await userCollection.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: { followedUsers: curFollowerList } }
    );

    if (!updateCurUser) {
      throw "Match unsuccessful!";
    }
    return [updateCurUser];
  }
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
  getUser,
  authUser,
  changeUser,
  getSelectedUsers,
  canSwipe,
  swipe,
  removeUser,
};
