const dbConnection = require("../config/mongoConnection");
const userData = require("../data/user.data");
const mongoCollections = require("../config/mongoCollections");
const { users } = mongoCollections;

async function main() {
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();

  const userCollection = await users();

  const user1 = {
    catName: "Pi",
    catGender: "M",
    catAge: 36,
    catBreed: "Maine Coon",
    catIsAltered: true,
    catGallery: [
      "https://cdn.catapp.com/9a499033-c49c-4673-b976-6941bfbe0fd7.jpg",
      "https://cdn.catapp.com/91ee5335-1a2f-470e-ab51-1750730b5201.jpg",
    ],
    userBio: "We found Pi as a stray living in one of our lifeboats...",
  };

  const userOne = await userData.createUser(
    "Richard Parker",
    "rparker@gmail.com",
    "meow"
  );
  const idOne = userOne._id.toString();
  await userData.changeUser(idOne, user1);

  const user2 = {
    userId: "8ad9b86e-bd89-4f1a-8455-728976bb14f6",
    userName: "John Smith",
    userCat: {
      catName: "Oscar",
      catGender: "M",
      catAge: 15,
      catBreed: "Scottish Fur",
      catIsAltered: true,
      catGallery: [
        "https://cdn.catapp.com/9a499033-c49c-4673-b976-6941bfbe0fd7.jpg",
        "https://cdn.catapp.com/91ee5335-1a2f-470e-ab51-1750730b5201.jpg",
      ],
    },
    userBio: "We found Oscar as a stray living in one of our lifeboats...",
    userLocation: {
      country: "USA",
      address1: "1234 ABC Drive",
      address2: "Sunset Drive, MA",
    },
    followedUsers: [
      "8ad9b86d-ad89-4f1a-8455-628926bb14f6",
      "f1b5e3c6-9c52-46fe-a09e-e60f511eca45",
    ],
    friendedUsers: ["8ad9b86d-ad89-4f1a-8455-628926bb14f6"],
    blockedUsers: ["76506898-eac7-4125-bce1-87ad234d069e"],
    userInbox: ["8ad9b86d-ad89-4f1a-8455-628926bb14f6"],
    friendRequests: ["b3792a7f-0617-4f8d-bfc8-2bbe20f44ad5"],
    userReports: [
      {
        reporterId: "3b127986-a10c-400a-8ac4-1d5980a74ec7",
        reason: "Fake Account",
        details: "User had pictures of dogs not cats.",
      },
    ],
    userComments: [
      {
        commenterId: "f174e4d8-140e-4200-8fec-33174f3dbde1",
        commentText: "That's one big cat...",
        likes: [
          {
            likerId: "f174e4d8-140e-4200-8fec-33174f3dbde1",
            likeValue: 1,
          },
        ],
      },
    ],
  };

  const insertUser = await userCollection.insertOne(user1);
  console.log(insertUser.insertedId);
  const insertUser2 = await userCollection.insertOne(user2);
  console.log(insertUser2.insertedId);
  await userCollection.find().toArray();
  dbConnection.closeConnection();
}

main().catch((error) => {
  console.error(error);
  return dbConnection().then((db) => {
    console.log("error");
    return db.serverConfig.close();
  });
});
