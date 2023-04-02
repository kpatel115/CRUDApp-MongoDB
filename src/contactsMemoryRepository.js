// Memory Repository
// handling all data access
const crypto = require('crypto');
const db = new Map();

  
db.set('ddad031e-e030-419a-9518-2f16534edeaf', {id: "ddad031e-e030-419a-9518-2f16534edeaf", name: "vawn", lname: "patel", email: "vawnpatel@gmail.com", notes: "this is example contact", date: 1676952665922})

//db map with two objects

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
  },
  deleteById: (uuid) => db.delete(uuid),
  update: (contact) => db.set(contact.id, contact),
};

module.exports = repo;

