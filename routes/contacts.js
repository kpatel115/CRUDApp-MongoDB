var express = require('express');
var router = express.Router();
const contactController = require('../controllers/contactController');
const { body } = require('express-validator');
//const { randomUUID } = require("node:crypto");
const contactsRepo = require('../src/contactsFileRepository');
// const contactsRepo = require('../src/contactsFileRepository.js');
const mongoRepo = require('../src/contactsMongoDBRepo');


/* GET Contacts Database. */
router.get('/', function(req, res, next) {
  const data = mongoRepo.findAll()
  res.render('contacts', { title: 'Express Contacts', contacts: data});
});

/* GET Create Contact Form */
router.get('/add', function(req, res, next) {
  res.render('contacts_add', { title: 'Add An Express Contact' });
});

/* POST Create Contact  */
router.post('/add', function(req, res, next) {
  // console.log(req.body);
  if(req.body.firstName.trim() === "") {
    res.render('contacts_add', { title: "Add a Contact", msg: "Please fill out the form"});
  } else {
    // add contact to database
    mongoRepo.create({name: req.body.firstName, lname: req.body.lastName, email:req.body.email, notes: req.body.notes, time: req.body.time})
    res.redirect('/contacts');
    res.send('contact created');
  }
  
});

/* GET Single Contact */ 
router.get('/:uuid', function(req, res, next) {
  const contact = mongoRepo.findById(req.params.uuid);
  if (contact) {
    res.render('contact', { title: 'Your Contact', contact: contact });
  } else {
    res.redirect('/contacts');
  }
  
});

/* GET Delete Contact */
router.get('/:uuid/delete', function(req, res, next) {
  const contact = mongoRepo.findById(req.params.uuid);
  res.render('contacts_delete', { title: 'Delete An Express Contact', contact: contact });
});

/* POST Delete Contact */
router.post('/:uuid/delete', function(req, res, next) {
  //delete from repo
  mongoRepo.deleteById(req.params.uuid);
  res.redirect('/contacts')
});

/* GET Edit Contact */
router.get('/:uuid/edit', function(req, res, next) {
  const contact = contactsRepo.findById(req.params.uuid);
  res.render('contacts_edit', { title: 'Edit An Express Contact', contact: contact });
});

/* POST Edit Contact  */
router.post('/:uuid/edit', function(req, res, next) {
  if (req.body.firstName.trim() === "") {
    const contact = contactsRepo.findById(req.params.uuid);
    res.render('contacts_edit', { title: "Edit a Contact", msg: 'Please fill out the form'});
  } else {
    // update Database
    const updatedContact = {id: req.params.uuid, name: req.body.firstName.trim(), lname: req.body.lastName.trim(), email: req.body.email.trim(), notes: req.body.notes.trim() };
    contactsRepo.update(updatedContact);
    res.redirect(`/contacts/${req.params.uuid}`);
  }
  
});

module.exports = router;
