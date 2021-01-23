const { application } = require("express");
var express = require("express");
var router = express.Router();

// Load User model
const Job = require("../models/Jobs");
const Recruiter = require("../models/Recruiter");
const Applicant = require("../models/Applicant");
const Application = require("../models/Application");

// GET request 
// Getting all the users
router.get("/", function (req, res) {
    Job.find(function (err, jobs) {
        if (err) {
            console.log(err);
        } else {
            res.json(jobs);
        }
    })
});

// Getting all the users
router.post("/:id/applications", function (req, res) {
    const recruiterKey = req.body.password;
    const email = req.body.email;

    Job.findById(req.params.id).populate({ path: 'applications', model: 'Application', populate: { path: '_applicant', model: 'Applicants' } })
        .then(job => {
            if (!job) {
                return res.status(404).send({
                    error: "Job doesn't exist!",
                });
            }
            else {
                if (job.recruiteremail == email) {
                    Recruiter.findOne({ email: email }).then(owner => {
                        if (!owner) {
                            // How did we get here?
                            res.status(500).send({ error: "This Job doesn't belong to anybody!" });
                        }
                        else {
                            if (owner.password != recruiterKey) {
                                res.status(400).send({ error: "You are not authorised [Wrong Password]!" });
                            }
                            else {
                                res.status(200).send({ array: job.applications });
                            }
                        }
                    });
                }
                else {
                    res.status(400).json({ error: "You are not authorised!" });
                }
            }
        });
});

// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

// POST request 
// Add a user to db
router.post("/postjob", (req, res) => {
    const email = req.body.recruiteremail;
    const recruiterKey = req.body.recruiterKey;
    Recruiter.findOne({ email }).then(recruiter => {
        // Check if user email exists
        if (!recruiter) {
            return res.status(404).json({
                error: "Recruiter doesn't exist!",
            });
        }
        else {
            //res.send("Email Found");
            if (recruiter.password != recruiterKey) {
                return res.status(404).json({
                    error: "Incorrect Password!",
                });
            }
            else {
                const newJob = new Job({
                    title: req.body.title,
                    /* TODO: Email integrity check? */
                    recruitername: recruiter.name,
                    recruiteremail: recruiter.email,
                    count: { applications: 0, positions: 0 },
                    limit: req.body.limit,
                    postedOn: Date.now(),
                    deadline: req.body.deadline,
                    /* TODO: Limit to Languages? */
                    skillset: req.body.skillset,
                    /* TODO: Enumerators ? */
                    type: req.body.type,
                    /* TODO: Limit to 1-6 months, and 0 indefinite */
                    duration: req.body.duration % 7,
                    /* TODO: Salary positive check */
                    salary: req.body.salary,
                    /* TODO: Dynamic ..... */
                    rating: 0
                });
                // Server side validations

                errMsg = "";

                if (!(["Full-Time", "Part-Time", "WFH"].includes(newJob.type))) {
                    errMsg += "Select Valid Job Type! ";
                }
                if (newJob.limit.applications < newJob.limit.positions) {
                    errMsg += "Max number of applications should be more than the positions! ";
                }
                var pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
                if (!(pattern.test(newJob.recruiteremail))) {
                    errMsg += "Invalid email format! ";
                }

                if (errMsg != "") {
                    return res.status(400).send({ error: "Form Validation Failed! " + errMsg });
                }

                newJob.save(function (err, job) {
                    if (err) {
                        console.log(err);
                        res.status(400).send({ error: err.message });
                    }
                    else {
                        recruiter.jobs.push(job._id);
                        recruiter.save();
                        res.status(200).json(job);
                    }
                })
            }
        }
    });
});


router.post("/:id/edit", (req, res) => {
    const recruiterKey = req.body.password;
    const email = req.body.email;
    const limit = req.body.limit;
    const deadline = req.body.deadline;

    Job.findById(req.params.id)
        .then(job => {
            if (!job) {
                return res.status(404).send({
                    error: "Job doesn't exist!",
                });
            }
            else {
                if (job.recruiteremail == email) {
                    Recruiter.findOne({ email: email }).then(owner => {
                        if (!owner) {
                            // How did we get here?
                            res.status(500).send({ error: "This Job doesn't belong to anybody!" });
                        }
                        else {
                            if (owner.password != recruiterKey) {
                                res.status(400).send({ error: "You are not authorised [Wrong Password]!" });
                            }
                            else {
                                job.limit = limit;
                                job.deadline = Date.parse(deadline);

                                job.save(function (err, done) {
                                    if (err) {
                                        res.status(400).send({ error: "Couldn't edit job : " + err });
                                    }
                                    else {
                                        res.status(200).send({ error: "Job Listing Updated!" });
                                    }
                                })
                            }
                        }
                    });
                }
                else {
                    res.status(400).json({ error: "You are not authorised!" });
                }
            }
        });
});

router.post("/:id/rate", (req, res) => {
    const applicantKey = req.body.password;
    const email = req.body.email;
    const applicationid = req.body.applicationid;
    const jobid = req.params.id;
    const rating = req.body.rating;

    Application.findById(applicationid)
        .then(application => {
            if (!application) {
                return res.status(404).send({
                    error: "Application doesn't exist!",
                });
            }
            else {
                Job.findById(jobid)
                    .then(job => {
                        if (!job) {
                            return res.status(404).send({
                                error: "Job doesn't exist!",
                            });
                        }
                        else if (application._job != jobid) {
                            return res.status(401).send({
                                error: "This application is not for that job!",
                            })
                        }
                        else {
                            Applicant.findOne({ email: email }).then(applicant => {
                                if (!applicant) {
                                    // How did we get here?
                                    res.status(404).send({ error: "This applicant doesn't exist" });
                                }
                                else {
                                    if (applicant.password != applicantKey) {
                                        res.status(400).send({ error: "You are not authorised [Wrong Password]!" });
                                    }
                                    else {

                                        if (applicant._id != application._applicant) {
                                            res.status(401).send({ error: "You did not make this application!" });
                                        }
                                        else {
                                            job.rating = (job.rating * job.ratedBy + rating) / (job.ratedBy + 1);
                                            job.ratedBy += 1;
                                            job.save(function (err, done) {
                                                if (err) {
                                                    res.status(400).send({ error: "Couldn't rate job : " + err });
                                                }
                                                else {
                                                    res.status(200).send({ error: "Job has been rated!" });
                                                }
                                            })
                                        }
                                    }
                                }
                            })
                        }
                    })
            }
        })
})

router.post("/:id/addapplication", (req, res) => {
    const applicantKey = req.body.password;
    const email = req.body.email;
    const application = req.body.application;
    if (application) {
        application.populate("_applicant");
    }
    else {
        return res.status(400).send({ error: "No application given" });
    }

    Job.findById(req.params.id)
        .then(job => {
            if (!job) {
                return res.status(404).send({
                    error: "Job doesn't exist!",
                });
            }
            else {
                if (application._applicant.email == email) {
                    Applicant.findOne({ email: email }).then(owner => {
                        if (!owner) {
                            // How did we get here?
                            res.status(500).send({ error: "This Application doesn't belong to anybody!" });
                        }
                        else {
                            if (owner.password != applicantKey) {
                                res.status(400).send({ error: "You are not authorised [Wrong Password]!" });
                            }
                            else {
                                job.count.applications += 1;
                                job.application.push(application._id);

                                job.save(function (err, done) {
                                    if (err) {
                                        res.status(400).send({ error: "Couldn't edit job : " + err });
                                    }
                                    else {
                                        res.status(200).send({ error: "Application successfully added!" });
                                    }
                                })
                            }
                        }
                    });
                }
                else {
                    res.status(400).json({ error: "You are not authorised!" });
                }
            }
        });
});


router.delete("/:id", (req, res) => {
    const recruiterKey = req.body.password;
    const email = req.body.email;

    Job.findById(req.params.id)
        .then(job => {
            if (job.recruiteremail == email) {
                Recruiter.findOne({ email: email }).then(owner => {
                    if (!owner) {
                        // How did we get here?
                        res.status(500).send({ error: "This Job doesn't belong to anybody!" });
                    }
                    else {
                        if (owner.password != recruiterKey) {
                            res.status(400).send({ error: "You are not authorised [Wrong Password]!" });
                        }
                        else {
                            Recruiter.updateOne({ _id: owner._id }, { $pullAll: { jobs: [job._id] } }).then(() => {
                                try {
                                    job.delete();
                                    res.status(200).send({ error: "Job Listing Deleted!" });
                                } catch (err) {
                                    res.status(400).send({ error: "Couldn't delete job : " + err });
                                }
                            }).catch(err => {
                                res.status(400).send({ error: "Could not update recruiter!: " + err });
                            })

                        }
                    }
                });
            }
            else {
                res.status(400).json({ error: "You are not authorised!" });
            }

        });
});

module.exports = router;

