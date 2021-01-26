/* eslint-disable prefer-promise-reject-errors */
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
  const userid = req.body.userid;
  const password = req.body.password;
  Jobs.findOne({_id: jobid, active: true}).then((job) => {
    if (!job) {
      return res.status(404).json({
        error: 'Job doesn\'t exist / Inactive!',
      });
    } else {
      Applicant.findById(userid).then((applicant) => {
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
  const applicationId = request.applicationid;
  const applicantId = request.applicantid;
  const jobId = request.jobid;
  const recruiterID = request.userid;
  Jobs.findByIdAndUpdate(jobId, {
    '$inc': {'count.positions': 1},
  }, {new: true})
      .then((job) => {
        Applicant.findByIdAndUpdate(applicantId, {doj: Date.now(), isHired: true})
            .then((applicant) => {
              if (!applicant) {
                return console.log('Applicant not found');
              } else {
                Recruiter.findByIdAndUpdate(recruiterID, {
                  '$push': {
                    'employees': {
                      '_applicant': applicantId,
                      '_job': jobId,
                      'doj': Date.now(),
                    },
                  },
                })
                    .then((recruiter)=>{
                      Jobs.updateMany({'_id': {'$ne': jobId}}, {
                        '$inc': {'count.applications': -1},
                        '$pull': {'applications': {'$in': [applicant.applications]}},
                      });
                      Application.updateMany({_applicant: applicantId, status: {$ne: 'Accepted'}}, {
                        status: 'Rejected',
                      }).then(() => {
                        if (job.count.positions >= job.limit.positions) {
                          // deactivateJob
                          Job.findByIdAndUpdate(jobId, {active: false})
                              .then((j) => {
                                Recruiter.findById(recruiterID).then((recruiter) => {
                                  j.applications.forEach((appl) => {
                                    Application.updateMany({_id: appl, status: {$ne: 'Accepted'}}, {status: 'Rejected'});
                                  });
                                });
                              });
                        }
                      });
                    });
              }
            });
      });
}


router.post('/:id/:status', (req, res) => {
  const userid = req.body.userid;
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
          Recruiter.findById(userid).then((recruiter) => {
            if (!recruiter) {
              return res.status(404).json({
                error: 'Recruiter doesn\'t exist!',
              });
            } else if (job._recruiter != userid) {
              return res.status(401).send({error: 'This job doesnt belong to this recruiter!'});
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

                      hireApplicant({
                        applicationid: req.params.id,
                        applicantid: appl._applicant,
                        userid: userid,
                        jobid: job._id,
                      });
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

