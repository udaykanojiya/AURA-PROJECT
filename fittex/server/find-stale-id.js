const mongoose = require('mongoose');
require('dotenv').config();

const TARGET_ID = '69b6a36053e4c6855888ff70';

async function locateDocument() {
  try {
    const mainConn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fittex');
    const admin = new mongoose.mongo.Admin(mainConn.connection.db);
    const dbsResult = await admin.listDatabases();
    const dbNames = dbsResult.databases.map(db => db.name);
    
    console.log(`Searching for _id: ${TARGET_ID} in all local databases...`);
    
    for (const dbName of dbNames) {
      if (['admin', 'local', 'config'].includes(dbName)) continue;
      
      const conn = await mongoose.createConnection(`mongodb://localhost:27017/${dbName}`).asPromise();
      const collections = await conn.db.listCollections().toArray();
      
      for (const colInfo of collections) {
        const doc = await conn.db.collection(colInfo.name).findOne({ _id: new mongoose.Types.ObjectId(TARGET_ID) });
        if (doc) {
          console.log(`\n✅ FOUND IT!`);
          console.log(`Database: ${dbName}`);
          console.log(`Collection: ${colInfo.name}`);
          console.log(`Password in this doc: ${doc.adminPassword}`);
          console.log(`Updated At: ${doc.updatedAt}`);
          await conn.close();
          await mainConn.close();
          process.exit(0);
        }
      }
      await conn.close();
    }
    
    console.log('\n❌ Could not find that _id in any local "localhost:27017" database.');
    console.log('This suggests you might be connected to a Cloud (Atlas) database in Compass.');
    await mainConn.close();
    process.exit(0);
  } catch (err) {
    console.error('Search failed:', err);
    process.exit(1);
  }
}

locateDocument();
