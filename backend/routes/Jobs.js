/* eslint-disable max-len */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


const Job = require('../models/Jobs');
const Recruiter = require('../models/Recruiter');
const Applicant = require('../models/Applicant');
const Application = require('../models/Application');

router.get('/', function(req, res) {
  Job.find().populate('_recruiter').then((jobs) => {
    if (!jobs) {
      console.log('No jobs to return');
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
  const userid = req.body.userid;

  Job.findById(req.params.id).populate({
    path: 'applications', model: 'Application',
    populate: {path: '_applicant', model: 'Applicants'},
  })
      .then((job) => {
        if (!job) {
          return res.status(404).send({
            error: 'Job doesn\'t exist!',
          });
        } else {
          if (job._recruiter == userid) {
            Recruiter.findById(userid).then((owner) => {
              if (!owner) {
              // How did we get here?
                res.status(500)
                    .send({error: 'This Job doesn\'t belong to anybody!'});
              } else {
                bcrypt.compare(password, owner.password).then((isMatch) => {
                  if (isMatch) {
                    const availableApplications = new Set([...job.applications]);
                    availableApplications.forEach((j, index) => {
                      if (j.status == 'Rejected') {
                        availableApplications.delete(j);
                      }
                    }, availableApplications);
                    res.status(200).send({array: Array.from(availableApplications)});
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
  const userid = req.body.userid;
  const password = req.body.password;
  Recruiter.findById(userid).then((recruiter) => {
    if (!recruiter) {
      return res.status(404).json({
        error: 'Recruiter doesn\'t exist!',
      });
    } else {
      bcrypt.compare(password, recruiter.password).then((isMatch) => {
        if (isMatch) {
          const newJob = new Job({
            title: req.body.title,
            _recruiter: recruiter._id,
            count: {applications: 0, positions: 0},
            limit: req.body.limit,
            postedOn: Date.now(),
            deadline: req.body.deadline,
            active: true,
            skillset: req.body.skillset,
            type: req.body.type,
            duration: req.body.duration % 7,
            salary: Number.parseFloat(req.body.salary).toFixed(0),
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
  const userid = req.body.userid;
  const limit = req.body.limit;
  const deadline = req.body.deadline;

  Job.findById(req.params.id)
      .then((job) => {
        if (!job) {
          return res.status(404).send({
            error: 'Job doesn\'t exist!',
          });
        } else {
          if (job._recruiter == userid) {
            Recruiter.findById(userid).then((owner) => {
              if (!owner) {
              // How did we get here?
                res.status(500).send({error: 'This Job doesn\'t belong to anybody!'});
              } else {
                bcrypt.compare(password, owner.password).then((isMatch) => {
                  if (isMatch) {
                    job.limit = limit;
                    job.deadline = Date.parse(deadline);

                    errMsg = '';

                    if (job.limit.positions < job.count.positions) {
                      errMsg += 'Already more than '+job.count.positions+' employees have been hired! ';
                    }

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
  const userid = req.body.userid;
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
                } else if (application.status != 'Accepted') {
                  return res.status(403).send({error: 'This application has not been accepted!'});
                } else {
                  Applicant.findById(userid).then((applicant) => {
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
  const userid = req.body.userid;

  Job.findById(req.params.id)
      .then((job) => {
        if (job._recruiter == userid) {
          Recruiter.findById(userid).then((owner) => {
            if (!owner) {
            // How did we get here?
              res.status(500).send({error: 'This Job doesn\'t belong to anybody!'});
            } else {
              bcrypt.compare(password, owner.password).then((isMatch) => {
                if (isMatch) {
                  Recruiter.findByIdAndUpdate(owner._id, {'$pull': {'jobs': job._id, 'employees': {'_job': job._id}}}).then((done) => {
                    job.applications.forEach((application) => {
                      Applicant.updateMany({_applications: application}, {'isHired': false, '$pull': {'_applications': application._id}}).then((done) => {
                        Application.deleteMany({_job: job._id}).then((done) => { });
                      }).catch((err) => {
                        return res.status(400).send({error: err});
                      });
                    });
                  }).catch((err) => {
                    return res.status(400).send({error: err});
                  });
                  Job.findByIdAndDelete(req.params.id).then((done)=>{
                    return res.status(200).send({error: 'Job deleted cascade!'});
                  }).catch((err)=>{
                    return res.status(400).send({error: err});
                  });
                } else {
                  return res.status(403).send({error: 'Password Incorrect'});
                }
              });
            }
          });
        } else {
          return res.status(403).json({error: 'You are not authorised!'});
        }
      });
});

module.exports = router;

