 var express = require('express');
 var router = express.Router();
 const contactsRepo = require('../src/contactsMongoDBRepo');
const { validationResult } = require('express-validator');
const Contact = require('../src/Contact');

/* GET Contacts listing. */
exports.contacts_list = async function(req, res, next) {
  const data = await contactsRepo.findAll();
  res.render('contacts', { title: 'Express Contact App', contacts: data });
};

/* GET create Contact form. */
exports.contacts_create_get = function(req, res, next) {
  res.render('contacts_add', { title: 'Add a Contact' });
};

/* POST create Contact. */
exports.contacts_create_post = async function(req, res, next) {
  //console.log(req.body);
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.render('contacts_add', { title: 'Add a Contact', msg: result.array() });
  } else {
    const newContact = new Contact('', req.body.name, req.body.lname, req.body.email, req.body.notes, '');
    await contactsRepo.create(newContact);
    res.redirect('/contacts');
  }
};

/* GET single Contact. */
exports.contacts_detail = async function(req, res, next) {
  const contact = await contactsRepo.findById(req.params.uuid);
  if (contact) {
    res.render('contact', { title: 'Your Contact', contact: contact });
  } else {
    res.redirect('/contacts');
  }
};

/* GET delete Contact */
exports.contacts_delete_get = async function(req, res, next) {
  const contact = await contactsRepo.findById(req.params.uuid);
  res.render('contacts_delete', { title: 'Delete Contacts', contact: contact });
};

/* POST delete contact. */
exports.contacts_delete_post = async function(req, res, next) {
  await contactsRepo.deleteById(req.params.uuid);
  res.redirect('/contacts');
};

/* GET edit contact */
exports.contacts_edit_get = async function(req, res, next) {
  const contact = await contactsRepo.findById(req.params.uuid);
  res.render('contacts_edit', { title: 'Edit Contact', contact: contact });
};

/* POST edit todo. */
exports.todos_edit_post = async function(req, res, next) {
  //console.log(req.body);
  if (req.body.firstName.trim() === '') {
    const contact = await contactsRepo.findById(req.params.uuid);
    res.render('contacts_edit', 
      { title: 'Edit Contact', msg: 'Contact field can not be empty!', contact: contact }
    );
  } else {
    const updatedContact = new Contact(req.params.uuid, req.body.name, req.body.lname, req.body.email, req.body.notes, req.params.time);
    await contactsRepo.update(updatedContact);
    res.redirect(`/contacts/${req.params.uuid}`);
  }
};