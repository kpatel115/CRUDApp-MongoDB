// Memory Repository
// handling all data access
const crypto = require('crypto');
const db = new Map();
const fs = require('fs');
const path = require('path');
  
// db.set('ddad031e-e030-419a-9518-2f16534edeaf', {name: "karan", id: "ddad031e-e030-419a-9518-2f16534edeaf"})
// db.set('e4a9c8f6-4bb8-44f5-8915-8df78500f6e3', {name: "patel", id: "e4a9c8f6-4bb8-44f5-8915-8df78500f6e3"})
// //db map with two objects

const loadData = () => {
  const jsonData = fs.readFileSync(path.join(__dirname, '../data/contacts.json'));
  const contactsArray = JSON.parse(jsonData);
  contactsArray.forEach(element => {
    db.set(element[0], element[1]);
  })   
};
const saveData = () => {
  const stringifyData = JSON.stringify(Array.from(db));
  fs.writeFileSync(path.join(__dirname, '../data/contacts.json'), stringifyData);
};

// repo set to object for application
const repo = {
  findAll: () => Array.from(db.values()),
  findById: (uuid) => db.get(uuid),
  create: (contact) => {
    const newContact = {
      id: crypto.randomUUID(),
      name: contact.name,
      lname: contact.lname,
      email: contact.email,
      notes: contact.notes,
      time: Date.now()
    };
    db.set(newContact.id, newContact);
    saveData();
  },
  deleteById: (uuid) =>{
   db.delete(uuid);
   saveData();
  },
  update: (contact) => {
    db.set(contact.id, contact);
    saveData();
  },
};

loadData();

module.exports = repo;

