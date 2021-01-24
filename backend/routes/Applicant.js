/* eslint-disable max-len */
const express = require('express');
const router = express.Router();


const Applicant = require('../models/Applicant');


router.get('/', function(req, res) {
  Applicant.find(function(err, applicants) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json(applicants);
    }
  });
});


router.post('/postedapplications', function(req, res) {
  Applicant.findOne({email: req.body.email})
      .populate({path: 'applications', populate: {path: '_job', model: 'Jobs'}})
      .then((applicant) => {
        if (!applicant) {
          return res.status(404).send({
            error: 'Email not found',
          });
        } else {
          if (applicant.password != req.body.password) {
            return res.status(403).send({
              error: 'Password Incorrect',
            });
          } else {
            applicant.applications.forEach((appl, index) => {
              applicant.applications[index]._job.applications = undefined;
              applicant.applications[index]._job.count = undefined;
            });
            console.log(applicant.applications);
            res.status(200).send(applicant.applications);
          }
        }
      });
});


router.post('/edit', function(req, res) {
  Applicant.findOne({email: req.body.curemail}).then((applicant) => {
    if (!applicant) {
      return res.status(404).send({
        error: 'Email not found',
      });
    } else {
      if (applicant.password != req.body.password) {
        return res.status(403).send({
          error: 'Password Incorrect',
        });
      } else {
        applicant.name = req.body.name;
        applicant.email = req.body.email;
        applicant.password = req.body.password;
        applicant.skills = req.body.skills;
        applicant.education = req.body.education;

        applicant.save(function(err) {
          if (err) {
            return res.status(400).send({error: 'Couldn\'t edit applicant : ' + err});
          } else {
            return res.status(200).send({error: 'Applicant info Updated!'});
          }
        });
      }
    }
  });
});

/* TODO: Get consistency on password, applicantKey, etc conventions */


router.post('/register', (req, res) => {
  const newApplicant = new Applicant({
    name: req.body.name,
    email: req.body.email,
    education: req.body.education,
    skills: req.body.skills,
    rating: 0,
    resume: [],
    profilepic: '',
    password: req.body.password,
    applications: [],
    /* TODO: Useless date ? */
    date: Date.now(),
  });

  errMsg = '';

  newApplicant.education.forEach((edu) => {
    if ((edu.endYear != '') && (edu.endYear != undefined) && (edu.endYear < edu.startYear)) {
      errMsg += 'End Year cannot be less than the start year! ';
    }
  });
  const pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
  if (!(pattern.test(newApplicant.email))) {
    errMsg += 'Invalid email format! ';
  }

  if (errMsg != '') {
    return res.status(201).send({error: 'Form Validation Failed! ' + errMsg});
  }


  if (errMsg != '') {
    return res.status(400).send({error: 'Form Validation Failed! ' + errMsg});
  }


  newApplicant.save()
      .then((applicant) => {
        res.status(201).json(applicant);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
});

/* TODO: Make all auth with hashKey + user _ids */


router.post('/login', (req, res) => {
  const password = req.body.password;

  Applicant.findOne({email: req.body.email}).populate('applications').then((applicant) => {
    if (!applicant) {
      return res.status(404).send({
        error: 'Email not found',
      });
    } else {
      if (applicant.password != password) {
        res.status(403).send({error: 'Password Incorrect'});
      } else {
        /* TODO: cleaner way to delete just one key */
        res.status(200).send({
          name: applicant.name,
          email: applicant.email,
          education: applicant.education,
          skills: applicant.skills,
          rating: applicant.rating,
          resume: applicant.resume,
          profilepic: applicant.profilepic,
          applications: applicant.applications,
        });
      }
    }
  });
});

module.exports = router;
