/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


const Application = require('../models/Application');
const Applicant = require('../models/Applicant');
const Jobs = require('../models/Jobs');


router.get('/', function(req, res) {
  Application.find(function(err, applications) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json(applications);
    }
  });
});


router.post('/create', (req, res) => {
  const jobid = req.body.jobid;
  const email = req.body.email;
  const password = req.body.password;
  Jobs.findOne({_id: jobid}).then((job) => {
    if (!job) {
      return res.status(404).json({
        error: 'Job doesn\'t exist!',
      });
    } else {
      Applicant.findOne({email: email}).then((applicant) => {
        if (!applicant) {
          return res.status(404).json({
            error: 'Applicant doesn\'t exist!',
          });
        } else {
          if (applicant.isHired) {
            return res.status(403).send({error: 'This applicant is already hired! You cant make any _applications!'});
          }
          if (applicant._applications.length >= 10) {
            return res.status(403).send({error: 'You have made 10 applications already, cannot post another!'});
          }
          if (new Date(job.deadline) <= new Date(Date.now())) {
            return res.status(403).send({error: 'The deadline for submission of application is over!'});
          }
          bcrypt.compare(password, applicant.password).then((isMatch) => {
            if (isMatch) {
              const newApplication = new Application({
                _applicant: applicant._id,
                _job: jobid,

                sop: req.body.sop,
                status: 'Submitted',
                /* TODO: Verify Date format. What is Day-23, Mmonth-June , etc.? */
                postedOn: Date.now(),
              });
              newApplication.save(function(err, appl) {
                if (err) {
                  console.log(err);
                } else {
                  applicant._applications.push(appl._id);
                  job.applications.push(appl._id);
                  job.count.applications += 1;
                  job.save();
                  applicant.save();
                  res.status(201).json(appl);
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
    }
  });
});

function hireApplicant(request) {
  const applicantId = request.id;
  const jobId = request.jobid;
  const recruiterEmail = request.email;
  const password = request.password;
  Recruiter.findOne({email: recruiterEmail}).then((recruiter) => {
    if (!recruiter) {
      console.log({
        error: 'Email not found',
      });
    } else {
      bcrypt.compare(password, recruiter.password).then((isMatch) => {
        if (isMatch) {
          Jobs.findById(request.jobid).then((job) => {
            if (!job) {
              console.log({
                error: 'Job not found',
              });
            } else if (job.recruiteremail != recruiterEmail) {
              console.log({error: 'This job is not for this recruiter'});
            } else {

            }
          });
          Applicant.findById(request.id).then((applicant) => {
            if (!applicant) {
              console.log({error: 'Applicant not found'});
            } else {
              recruiter.employees.push({
                _applicant: applicantId,
                _job: jobId,
                doj: Date.now(),
              }); // imp line!!!!
              applicant.doj = Date.now();
              applicant.isHired = true;
              applicant._applications.forEach((app) => {
                Application.findById(app).then((appl) => {
                  Jobs.findOne({_id: appl._job}).then((job) => {
                    if (!job) {
                      console.log({
                        error: 'Job doesn\'t exist!',
                      });
                    } else {
                      Recruiter.findOne({email: job.recruiteremail}).then((recruiter) => {
                        if (!recruiter) {
                          console.log({
                            error: 'Recruiter doesn\'t exist!',
                          });
                        } else if (appl.status != 'Accepted') {
                          appl.status = 'Rejected';
                          const index = job.applications.indexOf(appl._id);
                          if (index > -1) {
                            console.log(job.applications);
                            job.applications.splice(index, 1);
                            job.count.applications -= 1;
                            console.log(job.applications);
                          }
                          appl.save(function(err) {
                            if (err) {
                              console.log(err);
                            } else {
                              console.log({error: 'Employee has been hired!'});
                            }
                          });
                          job.save(function(err) {
                            if (err) {
                              console.log(err);
                            } else {
                              console.log({error: 'Employee has been hired!'});
                            }
                          });
                        }
                      });
                    }
                  });
                });
              });
              applicant.save(function(err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log({error: 'Employee has been hired!'});
                }
              });
              recruiter.save(function(err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log({error: 'Employee has been hired!'});
                }
              });
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
}


function deactivateJob(request) {
  const password = request.password;
  const email = request.email;
  const jobid = request.jobid;

  Job.findById(jobid)
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
                          if (application.status != 'Accepted') {
                            application.status == 'Rejected';
                          }
                          application.save();
                        });
                      });
                      job.delete();
                      res.status(201).send({error: 'Job is now deactivated since the positions are all full!'});
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
}


router.post('/:id/:status', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  Application.findById(req.params.id).then((appl) => {
    if (!appl) {
      return res.status(404).send({error: 'Application ID invalid!'});
    } else {
      Jobs.findOne({_id: appl._job}).then((job) => {
        if (!job) {
          return res.status(404).json({
            error: 'Job doesn\'t exist!',
          });
        } else {
          Recruiter.findOne({email: email}).then((recruiter) => {
            if (!recruiter) {
              return res.status(404).json({
                error: 'Recruiter doesn\'t exist!',
              });
            } else {
              bcrypt.compare(password, recruiter.password).then((isMatch) => {
                if (isMatch) {
                  if (
                    ((req.params.status == 'Shortlist') && (appl.status == 'Submitted')) ||
                    ((req.params.status == 'Accept') && (appl.status == 'Shortlisted')) ||
                    ((req.params.status == 'Reject') && (appl.status != 'Accepted'))) {
                    appl.status = req.params.status.toString() + 'ed';
                    if (appl.status == 'Rejected') {
                      const index = job.applications.indexOf(appl._id);
                      if (index > -1) {
                        job.applications.splice(index, 1);
                        job.count.applications -= 1;
                      }
                    } else if (appl.status == 'Accepted') {
                      appl.doj = Date.now();
                      job.count.positions += 1;
                      hireApplicant({id: appl._applicant, email: email, password: password, jobid: job._id});
                      if (job.count.positions >= job.limit.positions) {
                        deactivateJob({email: email, password: password, jobid: job._id});
                      }
                    }
                    appl.save(function(err) {
                      if (err) {
                        console.log(err);
                      } else {
                        job.save(function(err) {
                          if (err) {
                            console.log(err);
                          } else {
                            return res.status(200).send({error: 'Application has been ' + req.params.status + 'ed!'});
                          }
                        });
                      }
                    });
                  } else {
                    return res.status(400)
                        .send({
                          error: 'This application cannot be changed from ' +
                          appl.status + ' to ' + req.params.status + ' !',
                        });
                  }
                } else {
                  return res.status(403).json({
                    error: 'Incorrect Password!',
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

module.exports = router;

