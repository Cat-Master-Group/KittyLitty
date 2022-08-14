const dbConnection = require('../config/mongoConnection');

async function main() {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();
    await dbConnection.closeConnection();
}

main();