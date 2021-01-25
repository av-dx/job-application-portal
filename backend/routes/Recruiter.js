/* eslint-disable max-len */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const Recruiter = require('../models/Recruiter');
const Applicant = require('../models/Applicant');


router.get('/', function(req, res) {
  Recruiter.find(function(err, recruiters) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json(recruiters);
    }
  });
});


/* TODO: Currently returns all jobs, see moodle asked by Mehul */
router.post('/activejobs', function(req, res) {
  Recruiter.findOne({email: req.body.email}).populate('jobs')
      .then((recruiter) => {
        if (!recruiter) {
          return res.status(404).send({
            error: 'Invalid Recruiter Email',
          });
        } else {
          console.log(recruiter.jobs);
          res.status(200).json(recruiter.jobs);
        }
      });
});

router.post('/employees', function(req, res) {
  Recruiter.findOne({email: req.body.email})
      .populate({
        path: 'employees',
        populate: [
          {path: '_job', model: 'Jobs'},
          {path: '_applicant', model: 'Applicants'},
        ],
      })
      .then((recruiter) => {
        if (!recruiter) {
          return res.status(403).send({
            error: 'Invalid Recruiter Email',
          });
        } else {
          bcrypt.compare(req.body.password, recruiter.password).then((isMatch) => {
            if (isMatch) {
              const employees = [...recruiter.employees];
              employees.forEach((emp, index) => {
                employees[index]._applicant.password = undefined;
                employees[index]._applicant.applications = undefined;
              });

              console.log(employees);
              res.status(200).json(employees);
            } else {
              return res.status(403).send({
                error: 'Password Incorrect',
              });
            }
          });
        }
      });
});

router.post('/rateemployee/:id', function(req, res) {
  Recruiter.findOne({email: req.body.email})
      .then((recruiter) => {
        if (!recruiter) {
          return res.status(404).send({
            error: 'Invalid Recruiter Email',
          });
        } else {
          bcrypt.compare(req.body.password, recruiter.password).then((isMatch) => {
            if (isMatch) {
              Applicant.findById(req.params.id).then((applicant) => {
                if (!applicant) {
                  return res.status(404).send({
                    error: 'Applicant not found',
                  });
                } else {
                  const arr = recruiter.employees.map((a) => a._applicant);
                  if (arr.includes(req.params.id)) {
                    applicant.rating = (req.body.rating) % 6;
                    applicant.save(function(err, done) {
                      if (err) {
                        return res.status(400)
                            .send({error: 'Unable to rate applicant : ' + err});
                      } else {
                        return res.status(200)
                            .send({error: 'You gave the applicant : ' + (req.body.rating % 6)});
                      }
                    });
                  } else {
                    return res.status(403)
                        .send({error: 'This person is not an employee of your company!'});
                  }
                }
              });
            } else {
              return res.status(403).send({
                error: 'Password Incorrect',
              });
            }
          });
        }
      });
});


router.post('/edit', function(req, res) {
  Recruiter.findOne({email: req.body.curemail}).then((recruiter) => {
    if (!recruiter) {
      return res.status(404).send({
        error: 'Email not found',
      });
    } else {
      bcrypt.compare(req.body.password, recruiter.password).then((isMatch) => {
        if (isMatch) {
          recruiter.name = req.body.name;
          recruiter.email = req.body.email;
          recruiter.contact = req.body.contact;
          recruiter.bio = req.body.bio;

          recruiter.save(function(err, done) {
            if (err) {
              // eslint-disable-next-line max-len
              return res.status(400).send({error: 'Couldn\'t edit recruiter : ' + err});
            } else {
              return res.status(200).send({error: 'Recruiter info Updated!'});
            }
          });
        } else {
          return res.status(403).send({
            error: 'Password Incorrect',
          });
        }
      });
    }
  });
});


router.post('/register', (req, res) => {
  Recruiter.findOne({email: req.body.email}).then((recruiter) => {
    if (recruiter) {
      return res.status(400)
          .json({email: 'Email is already registered with us'});
    } else {
      const newRecruiter = new Recruiter({
        name: req.body.name,
        contact: req.body.contact,
        bio: req.body.bio,
        date: Date.now(),
        email: req.body.email,
        password: req.body.password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newRecruiter.password, salt, (err, hash) => {
          if (err) throw err;
          newRecruiter.password = hash;
          newRecruiter
              .save()
              .then((recruiter) => res.status(200).json({
                _id: recruiter._id,
                name: recruiter.name,
                email: recruiter.email,
                contact: recruiter.contact,
                bio: recruiter.bio,
              }) )
              .catch((err) => {
                console.log(err.message);
                res.status(400).send({error: err.message});
              });
        });
      });
    }
  });
});


router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  Recruiter.findOne({email}).then((recruiter) => {
    if (!recruiter) {
      return res.status(404).json({
        error: 'Email not found',
      });
    } else {
      bcrypt.compare(password, recruiter.password).then((isMatch) => {
        if (isMatch) {
          res.status(200).json({
            _id: recruiter._id,
            name: recruiter.name,
            email: recruiter.email,
            contact: recruiter.contact,
            bio: recruiter.bio,
          });
        } else {
          res.status(403).send({error: 'Password Incorrect'});
        }
      });
    }
  });
});

module.exports = router;
