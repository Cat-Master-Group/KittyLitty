const dbConnection = require("../config/mongoConnection");
const userData = require("../data/user.data");
const mongoCollections = require("../config/mongoCollections");
const { users } = mongoCollections;

async function main() {
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();

  const userCollection = await users();
  userCollection.createIndex({ userLocation: "2dsphere" });
  const userIds = [];

  const user1 = {
    userName: "Richard Parker",
    email: "rparker@yahoo.com",
    //ilovecats
    password: "$2a$16$y.n.Qd5NZ/x5Y3M52LhhVelcmH5Ptlf/etSZxbHLNH9WUlQLwH1te",
    userCat: {
      catName: "Pi",
      catGender: "M",
      catAge: 36,
      catBreed: "Maine Coon",
      catIsAltered: true,
      catGallery: [
        "https://www.boredpanda.com/blog/wp-content/uploads/2015/11/maine-coon-cats-24__605.jpg",
      ],
    },
    userBio: "We found Pi as a stray living in one of our lifeboats...",
    followedUsers: [],
    friendedUsers: [],
    blockedUsers: [],
    userInbox: [],
    userReports: [],
    userComments: [],
    filterMiles: 100000,
    userLocation: { type: "Point", coordinates: [0, 0] },
  };

  const user1Response = await userCollection.insertOne(user1);
  userIds.push(user1Response.insertedId.toString());

  const user2 = {
    userName: "Peet McGill",
    email: "leetpeet@seekpeet.com",
    //hideandseekpeet
    password: "$2a$16$p1M5VSSEYN2pnLc1w8r0qehda3G2ge5sic3QNO3jfH.MmNO1xkzXa",
    userCat: {
      catName: "Chuckie",
      catGender: "M",
      catAge: 75,
      catBreed: "American Short-Hair",
      catIsAltered: true,
      catGallery: [
        "https://cdn.mos.cms.futurecdn.net/tQWiu3vhqvetSzxvZHhTNQ-1920-80.jpg",
      ],
    },
    userBio: "Chuckie is tricky little fella who will do anything for a meal.",
    followedUsers: [userIds[0]],
    friendedUsers: [],
    blockedUsers: [],
    userInbox: [],
    userReports: [],
    userComments: [
      {
        commenterId: userIds[0],
        commentText: "He looks a little...",
        likes: [
          {
            likerId: userIds[0],
            likeValue: 1,
          },
        ],
      },
    ],
    filterMiles: 100000,
    userLocation: { type: "Point", coordinates: [0, 0] },
  };

  user2Response = await userCollection.insertOne(user2);
  userIds.push(user2Response.insertedId.toString());

  await dbConnection.closeConnection();
}

main().catch((error) => {
  console.error(error);
  return dbConnection().then((db) => {
    console.log("error");
    return db.serverConfig.close();
  });
});
