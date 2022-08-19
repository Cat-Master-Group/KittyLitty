const dbConnection = require('../config/mongoConnection');
const userData = require('../data/user.data');
const mongoCollections = require("../config/mongoCollections");
const { users } = mongoCollections;


async function main() {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();

    const userCollection = await users();

    var user1 = {
        userId: "8ad9b86d-ad89-4f1a-8455-628926bb14f6",
        userName: "Richard Parker",
        userCat: {
            catName: "Pi",
            catGender: "M",
            catAge: 36,
            catBreed: "Maine Coon",
            catIsAltered: true,
            catGallery: [
                "https://cdn.catapp.com/9a499033-c49c-4673-b976-6941bfbe0fd7.jpg",
                "https://cdn.catapp.com/91ee5335-1a2f-470e-ab51-1750730b5201.jpg",
            ],
        },
        userBio: "We found Pi as a stray living in one of our lifeboats...",
        userLocation: {
            country: "USA",
            address1: "1212 Larktown Drive",
            address2: "Union City, ND",
        },
        followedUsers: [
            "84741eca-740e-4931-beb2-7fb5ff6b8f0a",
            "f1b5e3c6-9c52-46fe-a09e-e60f511eca45",
        ],
        friendedUsers: ["84741eca-740e-4931-beb2-7fb5ff6b8f0a"],
        blockedUsers: ["76506898-eac7-4125-bce1-87ad234d069e"],
        userInbox: ["edae4ba6-c3c8-47f1-8abc-26d496bbda94"],
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

    console.log(await userCollection.insertOne(user1));
    console.log(await userCollection.find().toArray());
    await dbConnection.closeConnection();
}

main().catch((error) => {
    console.error(error);
    return dbConnection().then((db) => {
        console.log("error");
        return db.serverConfig.close();
    });
});

