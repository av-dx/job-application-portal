/* eslint-disable max-len */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');

const Applicant = require('../models/Applicant');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + '/images/');
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  cb(null, allowedFileTypes.includes(file.mimetype));
};

const upload = multer({storage, fileFilter});

router.get('/', function(req, res) {
  Applicant.find(function(err, applicants) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json(applicants);
    }
  });
});


router.post('/uploadphoto', upload.single('profilepic'), function(req, res) {
  const profilepic = req.file.filename;
  Applicant.findOne({email: req.body.curemail}).then((applicant) => {
    if (!applicant) {
      return res.status(404).send({
        error: 'Email not found',
      });
    } else {
      bcrypt.compare(req.body.password, applicant.password).then((isMatch) => {
        if (isMatch) {
          applicant.profilepic = profilepic;

          applicant.save(function(err) {
            if (err) {
              return res.status(400).send({error: 'Couldn\'t edit applicant : ' + err});
            } else {
              return res.status(200).send({error: 'Applicant info Updated!'});
            }
          });
        } else {
          res.status(403).send({error: 'Password Incorrect'});
        }
      });
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
      bcrypt.compare(req.body.password, applicant.password).then((isMatch) => {
        if (isMatch) {
          applicant.name = req.body.name;
          applicant.email = req.body.email;
          applicant.skills = req.body.skills;
          applicant.education = req.body.education;

          errMsg = '';

          applicant.education.forEach((edu) => {
            if ((edu.endYear != '') && (edu.endYear != undefined) && (edu.endYear < edu.startYear)) {
              errMsg += 'End Year cannot be less than the start year! ';
            }
          });

          if (errMsg != '') {
            return res.status(400).send({error: 'Form Validation Failed! ' + errMsg});
          }

          applicant.save(function(err) {
            if (err) {
              return res.status(400).send({error: 'Couldn\'t edit applicant : ' + err});
            } else {
              return res.status(200).send({error: 'Applicant info Updated!'});
            }
          });
        } else {
          res.status(403).send({error: 'Password Incorrect'});
        }
      });
    }
  });
});


router.post('/postedapplications', function(req, res) {
  Applicant.findOne({email: req.body.email})
      .populate({path: '_applications', populate: {path: '_job', model: 'Jobs'}})
      .then((applicant) => {
        if (!applicant) {
          return res.status(404).send({
            error: 'Email not found',
          });
        } else {
          bcrypt.compare(req.body.password, applicant.password).then((isMatch) => {
            if (isMatch) {
              applicant._applications.forEach((appl, index) => {
                applicant._applications[index]._job.applications = undefined;
                applicant._applications[index]._job.count = undefined;
              });
              console.log(applicant._applications);
              res.status(200).send(applicant._applications);
            } else {
              res.status(403).send({error: 'Password Incorrect'});
            }
          });
        }
      });
});

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
    _applications: [],
    /* TODO: Useless date ? */
    date: Date.now(),
    isHired: false,
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
    return res.status(400).send({error: 'Form Validation Failed! ' + errMsg});
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newApplicant.password, salt, (err, hash) => {
      if (err) throw err;
      newApplicant.password = hash;
      newApplicant
          .save()
          .then((applicant) => res.status(201).json(applicant))
          .catch((err) => {
            console.log(err.message);
            res.status(400).send({error: err.message});
          });
    });
  });
});

router.post('/login', (req, res) => {
  const password = req.body.password;

  Applicant.findOne({email: req.body.email}).populate('_applications').then((applicant) => {
    if (!applicant) {
      return res.status(404).send({
        error: 'Email not found',
      });
    } else {
      bcrypt.compare(password, applicant.password).then((isMatch) => {
        if (isMatch) {
          res.status(200).send({
            _id: applicant._id,
            name: applicant.name,
            email: applicant.email,
            education: applicant.education,
            skills: applicant.skills,
            rating: applicant.rating,
            resume: applicant.resume,
            profilepic: applicant.profilepic,
            _applications: applicant._applications,
            isHired: applicant.isHired,
          });
        } else {
          res.status(403).send({error: 'Password Incorrect'});
        }
      });
    }
  });
});


router.get('/profilepic/:id', (req, res) => {
  Applicant.findById(req.params.id).then((applicant) => {
    if (!applicant) {
      return res.status(404).send({
        error: 'Email not found',
      });
    } else {
      try {
        res.set({
          'Content-Type': 'image/png',
        });
        res.status(200).sendFile(__dirname + '/images/' + applicant.profilepic, function(error) {
          console.log(error);
          res.status(404).sendFile(__dirname+'/images/placeholder');
        });
      } catch (error) {
        console.log(error);
      }
    }
  });
});


module.exports = router;
