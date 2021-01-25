/* eslint-disable max-len */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


const Job = require('../models/Jobs');
const Recruiter = require('../models/Recruiter');
const Applicant = require('../models/Applicant');
const Application = require('../models/Application');

router.get('/', function(req, res) {
  Job.find(function(err, jobs) {
    if (err) {
      console.log(err);
    } else {
      const availablejobs = new Set([...jobs]);
      availablejobs.forEach((j, index) => {
        if (new Date(j.deadline) < new Date(Date.now())) {
          availablejobs.delete(j);
        }
      }, availablejobs);
      res.status(200).json(Array.from(availablejobs));
    }
  });
});


router.post('/:id/applications', function(req, res) {
  const password = req.body.password;
  const email = req.body.email;

  Job.findById(req.params.id).populate({
    path: 'applications', model: 'Application',
    populate: {path: '_applicant', model: 'Applicants'}})
      .then((job) => {
        if (!job) {
          return res.status(404).send({
            error: 'Job doesn\'t exist!',
          });
        } else {
          if (job.recruiteremail == email) {
            Recruiter.findOne({email: email}).then((owner) => {
              if (!owner) {
                // How did we get here?
                res.status(500)
                    .send({error: 'This Job doesn\'t belong to anybody!'});
              } else {
                bcrypt.compare(password, owner.password).then((isMatch) => {
                  if (isMatch) {
                    res.status(200).send({array: job.applications});
                  } else {
                    res.status(403).send({error: 'Password Incorrect'});
                  }
                });
              }
            });
          } else {
            res.status(403).json({error: 'You are not authorised!'});
          }
        }
      });
});


router.post('/postjob', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  Recruiter.findOne({email}).then((recruiter) => {
    if (!recruiter) {
      return res.status(404).json({
        error: 'Recruiter doesn\'t exist!',
      });
    } else {
      bcrypt.compare(password, recruiter.password).then((isMatch) => {
        if (isMatch) {
          const newJob = new Job({
            title: req.body.title,
            /* TODO: Email integrity check? */
            recruitername: recruiter.name,
            recruiteremail: recruiter.email,
            count: {applications: 0, positions: 0},
            limit: req.body.limit,
            postedOn: Date.now(),
            deadline: req.body.deadline,
            active: true,
            /* TODO: Limit to Languages? */
            skillset: req.body.skillset,
            /* TODO: Enumerators ? */
            type: req.body.type,
            /* TODO: Limit to 1-6 months, and 0 indefinite */
            duration: req.body.duration % 7,
            /* TODO: Salary positive check */
            salary: Number.parseFloat(req.body.salary).toFixed(),
            /* TODO: Dynamic ..... */
            rating: 0,
            ratedBy: 0,
          });
          // Server side validations

          errMsg = '';

          if (!(['Full-Time', 'Part-Time', 'WFH'].includes(newJob.type))) {
            errMsg += 'Select Valid Job Type! ';
          }
          if (newJob.limit.applications < newJob.limit.positions) {
            errMsg += 'Max number of applications should be more than the positions! ';
          }
          const pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
          if (!(pattern.test(newJob.recruiteremail))) {
            errMsg += 'Invalid email format! ';
          }

          if (errMsg != '') {
            return res.status(400)
                .send({error: 'Form Validation Failed! ' + errMsg});
          }

          newJob.save(function(err, job) {
            if (err) {
              console.log(err);
              res.status(400).send({error: err.message});
            } else {
              recruiter.jobs.push(job._id);
              recruiter.save();
              res.status(201).json(job);
            }
          });
        } else {
          res.status(403).send({error: 'Password Incorrect'});
        }
      });
    }
  });
});


router.post('/:id/edit', (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const limit = req.body.limit;
  const deadline = req.body.deadline;

  Job.findById(req.params.id)
      .then((job) => {
        if (!job) {
          return res.status(404).send({
            error: 'Job doesn\'t exist!',
          });
        } else {
          if (job.recruiteremail == email) {
            Recruiter.findOne({email: email}).then((owner) => {
              if (!owner) {
                // How did we get here?
                res.status(500).send({error: 'This Job doesn\'t belong to anybody!'});
              } else {
                bcrypt.compare(password, owner.password).then((isMatch) => {
                  if (isMatch) {
                    job.limit = limit;
                    job.deadline = Date.parse(deadline);

                    errMsg = '';

                    if (job.limit.applications < job.limit.positions) {
                      errMsg += 'Max number of applications should be more than the positions! ';
                    }

                    if (errMsg != '') {
                      return res.status(400)
                          .send({error: 'Form Validation Failed! ' + errMsg});
                    }

                    job.save(function(err) {
                      if (err) {
                        res.status(400).send({error: 'Couldn\'t edit job : ' + err});
                      } else {
                        res.status(200).send({error: 'Job Listing Updated!'});
                      }
                    });
                  } else {
                    res.status(403).send({error: 'Password Incorrect'});
                  }
                });
              }
            });
          } else {
            res.status(400).json({error: 'You are not authorised!'});
          }
        }
      });
});

router.post('/:id/rate', (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const applicationid = req.body.applicationid;
  const jobid = req.params.id;
  const rating = req.body.rating;

  Application.findById(applicationid)
      .then((application) => {
        if (!application) {
          return res.status(403).send({
            error: 'Application doesn\'t exist!',
          });
        } else {
          Job.findById(jobid)
              .then((job) => {
                if (!job) {
                  return res.status(403).send({
                    error: 'Job doesn\'t exist!',
                  });
                } else if (application._job != jobid) {
                  return res.status(403).send({
                    error: 'This application is not for that job!',
                  });
                } else {
                  Applicant.findOne({email: email}).then((applicant) => {
                    if (!applicant) {
                      // How did we get here?
                      res.status(404)
                          .send({error: 'This applicant doesn\'t exist'});
                    } else {
                      bcrypt.compare(password, applicant.password).then((isMatch) => {
                        if (isMatch) {
                          if (applicant._id.toString() != application._applicant.toString()) {
                            res.status(403)
                                .send({error: 'You did not make this application!'});
                          } else {
                            job.rating = (job.rating * job.ratedBy + rating) / (job.ratedBy + 1);
                            job.ratedBy += 1;
                            job.save(function(err) {
                              if (err) {
                                res.status(400)
                                    .send({error: 'Couldn\'t rate job : ' + err});
                              } else {
                                res.status(200)
                                    .send({error: 'Job has been rated!'});
                              }
                            });
                          }
                        } else {
                          res.status(403).send({error: 'Password Incorrect'});
                        }
                      });
                    }
                  });
                }
              });
        }
      });
});

router.delete('/:id', (req, res) => {
  const password = req.body.password;
  const email = req.body.email;

  Job.findById(req.params.id)
      .then((job) => {
        if (job.recruiteremail == email) {
          Recruiter.findOne({email: email}).then((owner) => {
            if (!owner) {
              // How did we get here?
              res.status(500).send({error: 'This Job doesn\'t belong to anybody!'});
            } else {
              bcrypt.compare(password, owner.password).then((isMatch) => {
                if (isMatch) {
                  Recruiter.updateOne({_id: owner._id}, {$pullAll: {jobs: [job._id]}}).then(() => {
                    try {
                      job.applications.forEach((appl) => {
                        Application.findById(appl).populate('_applicant').then((application)=>{
                          Applicant.findById(application._applicant).then((applicant) => {
                            const index = applicant.applications.indexOf(appl);
                            applicant.isHired = false;
                            if (index >= 0) {
                              applicant.applications.splice( index, 1 );
                            }
                            applicant.save();
                          });
                          owner.employees.forEach((employee, index) => {
                            owner.employees.splice(index, 1);
                          }, owner.employees);
                          application.delete();
                          owner.save();
                        });
                      });
                      job.delete();
                      res.status(201).send({error: 'Job Listing Deleted!'});
                    } catch (err) {
                      res.status(400).send({error: 'Couldn\'t delete job : ' + err});
                    }
                  }).catch((err) => {
                    res.status(400).send({error: 'Could not update recruiter!: ' + err});
                  });
                } else {
                  res.status(403).send({error: 'Password Incorrect'});
                }
              });
            }
          });
        } else {
          res.status(403).json({error: 'You are not authorised!'});
        }
      });
});

module.exports = router;

