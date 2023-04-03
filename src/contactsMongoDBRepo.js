const { MongoClient, ObjectId } = require('mongodb');
const Contact = require('./Contact'); //Todo

//const url = 'mongodb://localhost:27017';
const url = process.env.MONGODB_URL;
const client = new MongoClient(url);

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
    const contactCol = client.db('expresscontactapp').collection('contacts');
    const cursor = contactCol.find({});
    await cursor.forEach(doc => {
      const aContact = new Contact(doc._id.toString(), doc.text);
      contacts.push(aContact);
    });
    return contacts;
  },
  findById: async (uuid) => {
    const contactCol = client.db('expresscontactapp').collection('contacts');
    const filter = {
      '_id': new ObjectId(uuid)
    };
    const doc = await contactCol.findOne(filter);
    return new Contact(doc._id.toString(), doc.text);
  },
  create: async (contact) => {
    const doc = {text: todo.text};
    const contactCol = client.db('expresscontactapp').collection('contacts');
    const result = await contactCol.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  },
  deleteById: async (uuid) => {
    const contactCol = client.db('expresscontactapp').collection('contacts');
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
    const contactCol = client.db('expresscontactapp').collection('contacts');
    const filter = {
      '_id': new ObjectId(contact.id)
    };
    const updateDoc = {
      $set: {
        name: contact.name,
        lname: contact.lname,
        email: contact.email,
        notes: contact.notes,
        time: Date.now()
      }
    };
    const result = await contactCol.updateOne(filter, updateDoc);
    console.log(`${result.matchedCount} docs matched the filter, updated ${result.modifiedCount} document(s)`);
  },
};

module.exports = repo;