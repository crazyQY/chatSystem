const MongoClient = require('mongodb').MongoClient,
      assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'chatRoom';
// Use connect method to connect to the server
var connectMongo = function (callback, data, fn, collectionName) {
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    console.log(db);
    const collection = db.collection(collectionName);
    callback(collection, data, fn);
    client.close();
  });
}


const insertDocuments = function(db, callback, data) {
  // Get the documents collection
  const collection = db.collection('user');
  // Insert some documents
  collection.insertMany(data, function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted documents success");
    callback(result);
  });
};

const findDocuments = function(collection, data, fn) {
  collection.find(data).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    fn(docs);
  });
};

const findExist = function (collection, data, fn) {
  // console.log(collection, data, fn);
  collection.count(data, function(err, result) {
    fn(result);
  });
};



module.exports = {
  connectMongo: connectMongo,
  insert: insertDocuments,
  find: findDocuments,
  findExist: findExist
};