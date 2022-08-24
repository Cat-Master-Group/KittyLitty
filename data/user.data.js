const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const mongoCollections = require("../config/mongoCollections");
const { checkId, checkString } = require("../validations");
const { createConversation } = require("./conversations.data");
const { users } = mongoCollections;
const saltRounds = 16;

const createUser = async (payload) => {
  if (
    !payload ||
    !payload.userName ||
    !payload.email ||
    !payload.password ||
    !payload.userCat ||
    !payload.userCat.catName ||
    !payload.userCat.catGender ||
    !payload.userCat.catAge ||
    !payload.userCat.catBreed ||
    !payload.userCat.catIsAltered ||
    !payload.userCat.catGallery ||
    !payload.userBio ||
    !payload.userLocation ||
    !Array.isArray(payload.userLocation) ||
    payload.userLocation.length != 2
  ) {
    throw "signup incomplete";
  }

  const userCollection = await users();

  payload.password = await bcrypt.hash(payload.password, saltRounds);
  payload.userLocation = {
    type: "Point",
    coordinates: payload.userLocation,
  };
  const oneUser = await userCollection.insertOne(payload);
  if (oneUser.insertedCount === 0) {
    throw "Insert failed!";
  }

  return await getUser(oneUser.insertedId.toString());
};

const getUser = async (id) => {
  try {
    checkId(id);
  } catch (error) {
    throw error;
  }

  const userCollection = await users();
  const oneUser = await userCollection.findOne({ _id: ObjectId(id) });
  if (!oneUser) {
    throw "User not found";
  }

  return oneUser;
};

const getUserArray = async (userArray, projection) => {
  const userCollection = await users();
  const queryArray = [];
  if (userArray) {
    userArray.forEach((element) => {
      queryArray.push(ObjectId(element));
    });
  }
  if (projection) {
    return await userCollection
      .find({ _id: { $in: queryArray } }, projection)
      .toArray();
  } else {
    return await userCollection.find({ _id: queryArray }).toArray();
  }
};

const getAllUser = async () => {
  const userCollection = await users();
  const allUsers = await userCollection.find({}).toArray();
  return allUsers;
};

const authUser = async (email, password) => {
  try {
    checkString(email);
    checkString(password);
  } catch (error) {
    throw error;
  }

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
  if (changeObj.catGallery) {
    const catArr = changeObj.catGallery.split(",");
    updateChanges.userCat.catGallery = catArr;
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
      coordinates: changeObj.userLocation,
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
  let filterMiles = 100000;

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
  checkId(id);
  checkId(matchId);
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
    let userFollowedList = [];
    if (curUser.followedUsers) {
      userFollowedUsers = [...curUser.followedUsers];
    }
    userFriendList.push(ObjectId(matchId));
    userFollowedList.push(ObjectId(matchId));
    matchFriendList.push(ObjectId(id));

    /*
    const matchFollowListIndex = matchUser.followedUsers.indexOf(ObjectId(id));
    matchUser.followedUsers.splice(matchFollowListIndex);
    */


    const updateCurUser = await userCollection.findOneAndUpdate(
      { _id: ObjectId(id) },
      {
        $set: {
          friendedUsers: userFriendList,
          followedUsers: userFollowedList
        }
      }
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

const reportOneUser = async (id, offendedId, reason, details) => {
  const userCollection = await users();
  const curUser = await getUser(id);
  const offUser = await getUser(offendedId);
  console.log(offUser);

  const reportObj = {
    reporterId: ObjectId(id),
    details,
    reason,
  };

  if (!curUser.blockedUsers) {
    curUser.blockedUsers = [];
  }
  curUser.blockedUsers.push(ObjectId(offendedId));

  if (!offUser.userReports) {
    offUser.userReports = [];
  }
  offUser.userReports.push(reportObj);

  const updateCur = await userCollection.updateOne(
    { _id: ObjectId(id) },
    {
      $set: { blockedUsers: curUser.blockedUsers },
    }
  );

  const updateOffended = await userCollection.updateOne(
    { _id: ObjectId(offendedId) },
    { $set: { userReports: offUser.userReports } }
  );
  if (!updateCur.matchedCount && !updateCur.modifiedCount) {
    throw "Update failed";
  }
  if (!updateOffended.matchedCount && !updateOffended.modifiedCount) {
    throw "Update failed";
  }
  return true;
};

const addComment = async (commentTargetId, commentObj) => {
  const userCollection = await users();
  const curUser = await getUser(commentObj.commenterId);
  const targetUser = await getUser(commentTargetId);
  if (!curUser) {
    throw 'Commenter ID invalid.';
  }

  if (!targetUser) {
    throw 'Comment target ID invalid';
  }

  if (targetUser.blockedUsers && targetUser.blockedUsers.includes(curUser._id)) {
    throw 'Comment target is blocking commenter';
  }

  if (!targetUser.userComments) {
    targetUser.userComments = [];
  }
  targetUser.userComments.push(commentObj);

  const updateTarget = await userCollection.updateOne(
    { _id: ObjectId(commentTargetId) },
    {
      $set: { userComments: targetUser.userComments },
    }
  );

  if (!updateTarget.matchedCount && !updateTarget.modifiedCount) {
    throw "Update failed";
  }

  return updateTarget;
}

const likeComment = async (id, index, likeObj) => {
  const userCollection = await users();
  const curUser = await getUser(likeObj.likerId);
  const targetUser = await getUser(id);

  if (!curUser) {
    throw 'Liker ID invalid.';
  }

  if (!targetUser) {
    throw 'Comment owner ID invalid';
  }

  if (!targetUser.userComments || !targetUser.userComments[index]) {
    throw 'Comment not found';
  }

  if (!targetUser.userComments[index].likes) {
    targetUser.userComments[index].likes = [];
  }

  const likeIndex = targetUser.userComments[index].likes.findIndex((element) => {
    return element.likerId === likeObj.likerId;
  });

  if (likeIndex === -1) {
    targetUser.userComments[index].likes.push(likeObj);
  } else {
    targetUser.userComments[index].likes[likeIndex] = likeObj;
  }


  const updateTarget = await userCollection.updateOne(
    { _id: ObjectId(id) },
    {
      $set: { userComments: targetUser.userComments },
    }
  );

  if (!updateTarget.matchedCount && !updateTarget.modifiedCount) {
    throw "Update failed";
  }

  return updateTarget;
}

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
  getUserArray,
  authUser,
  changeUser,
  getSelectedUsers,
  canSwipe,
  swipe,
  removeUser,
  reportOneUser,
  getAllUser,
  addComment,
  likeComment,
};
