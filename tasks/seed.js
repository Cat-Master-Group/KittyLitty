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

  const user3 = {
    userName: "Deee Dee",
    email: "from@dexterLab.com",
    //fancyUnicorn
    password: "$2a$16$xXvhEZYNAm8FVf.q567Md.l8lP0AFDfpRoesxNgfSa6EHLAAnDzB.",
    userCat: {
      catName: "Unicorn",
      catGender: "Male",
      catAge: 25,
      catBreed: "Devon Rex",
      catIsAltered: true,
      catGallery: [
        "https://i.ytimg.com/vi/PzPMxMnE5xc/hqdefault.jpg",
        "https://data.whicdn.com/images/62107064/original.png",
      ],
    },
    userBio:
      "Unicorn is secretly a unicorn that is pretending to be a cat. She loves to mess with my brother and is huge fan of monkeys!",
    followedUsers: [userIds[1], userIds[0]],
    friendedUsers: [],
    blockedUsers: [],
    userInbox: [],
    userReports: [],
    userComments: [
      {
        commenterId: userIds[1],
        commentText: "Woah! I never thought I'd see a real unicorn",
        likes: [
          {
            likerId: userIds[1],
            likeValue: 1,
          },
        ],
      },
      {
        commenterId: userIds[0],
        commentText: "Woah! I never thought I'd see a real unicorn",
        likes: [
          {
            likerId: userIds[0],
            likeValue: 1,
          },
        ],
      },
    ],
    filterMiles: 100000,
    userLocation: { type: "Point", coordinates: [41, -72] },
  };

  user3Response = await userCollection.insertOne(user3);
  userIds.push(user3Response.insertedId.toString());

  const user4 = {
    userName: "Walt the D",
    email: "walt@sueus.com",
    //fancyUnicorn
    password: "$2a$16$xXvhEZYNAm8FVf.q567Md.l8lP0AFDfpRoesxNgfSa6EHLAAnDzB.",
    userCat: {
      catName: "Unicorn",
      catGender: "Male",
      catAge: 25,
      catBreed: "Chantilly-Tiffany",
      catIsAltered: true,
      catGallery: [
        "https://cdn.mos.cms.futurecdn.net/tQWiu3vhqvetSzxvZHhTNQ-1920-80.jpg",
      ],
    },
    userBio:
      "Unicorn is secretly a unicorn that is pretending to be a cat. She loves to mess with my brother and is huge fan of monkeys!",
    followedUsers: [userIds[1], userIds[0]],
    friendedUsers: [],
    blockedUsers: [],
    userInbox: [],
    userReports: [],
    userComments: [],
    filterMiles: 100000,
    userLocation: { type: "Point", coordinates: [30, -30] },
  };

  user4Response = await userCollection.insertOne(user4);
  userIds.push(user4Response.insertedId.toString());

  const user5 = {
    userName: "Walt the D",
    email: "walt@sueus.com",
    //mousefriend
    password: "",
    userCat: {
      catName: "Fel",
      catGender: "Male",
      catAge: 55,
      catBreed: "Chantilly-Tiffany",
      catIsAltered: true,
      catGallery: [
        "https://static.wikia.nocookie.net/disneyfanon/images/e/e8/Felix_The_Cat.png/revision/latest?cb=20210303111640",
        "https://upload.wikimedia.org/wikipedia/commons/f/f2/Felix_the_Cat%2C_by_Raoul_Barr%C3%A9.gif",
        "https://ih1.redbubble.net/image.3046062797.7246/st,small,507x507-pad,600x600,f8f8f8.jpg",
      ],
    },
    userBio:
      "Unicorn is secretly a unicorn that is pretending to be a cat. She loves to mess with my brother and is huge fan of monkeys!",
    followedUsers: [userIds[1], userIds[0]],
    friendedUsers: [],
    blockedUsers: [],
    userInbox: [],
    userReports: [],
    userComments: [],
    filterMiles: 100000,
    userLocation: { type: "Point", coordinates: [10, -10] },
  };

  user5Response = await userCollection.insertOne(user5);
  userIds.push(user5Response.insertedId.toString());

  await dbConnection.closeConnection();
}

main().catch((error) => {
  console.error(error);
  return dbConnection().then((db) => {
    console.log("error");
    return db.serverConfig.close();
  });
});
