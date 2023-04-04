const { MongoClient, ObjectId } = require('mongodb');
const Contact = require('./Contact'); 
//const url = 'mongodb://localhost:27017';
const url = 'mongodb+srv://kpatel114:kpatel115@cluster542.ibmkweb.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);

var date = new Date(); 
var newdate = date.toGMTString();

async function run() {
  await client.connect();
  return 'Connected to the MongoDB server...';
}

run()
  .then(console.log)
  .catch(console.error);

const repo = {
  findAll: async () => {
    let contacts = [];
    const contactCol = client.db('contactMongoDB').collection('expresscontacts');
    const cursor = contactCol.find({});
    await cursor.forEach(contact => {
      const aContact = new Contact(contact._id.toString(), contact.name, contact.lname, contact.email, contact.notes, contact.time);
      contacts.push(aContact);
    });
    return contacts;
  },
  findById: async (uuid) => {
    const contactCol = client.db('contactMongoDB').collection('expresscontacts');
    const filter = {
      '_id': new ObjectId(uuid),
    };
    const contact = await contactCol.findOne(filter);
    return new Contact(uuid, contact.name, contact.lname, contact.email, contact.notes, contact.time);
  },
  create: async (contact) => {
    const doc = {name: contact.name, lname: contact.lname, email: contact.email, notes: contact.notes, time: contact.time};
    const contactCol = client.db('contactMongoDB').collection('expresscontacts');
    const result = await contactCol.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  },
  deleteById: async (uuid) => {
    const contactCol = client.db('contactMongoDB').collection('expresscontacts');
    const filter = {
      '_id': new ObjectId(uuid)
    };
    const result = await contactCol.deleteOne(filter);
    if (result.deletedCount === 1) {
      console.log("Successfully deleted a documents.");
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }
  },
  update: async (contact) => { 
    const contactCol = client.db('contactMongoDB').collection('expresscontacts');
    const filter = {
      '_id': new ObjectId(contact.id)
    };
    const updateDoc = {
      $set: {
      name: contact.name,
      lname: contact.lname,
      email: contact.email,
      notes: contact.notes,
      time: newdate
      }
    };
    const result = await contactCol.updateOne(filter, updateDoc);
    console.log(`${result.matchedCount} docs matched the filter, updated ${result.modifiedCount} document(s)`);
  },
};

module.exports = repo;