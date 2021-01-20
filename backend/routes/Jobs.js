const { application } = require("express");
var express = require("express");
var router = express.Router();

// Load User model
const Job = require("../models/Jobs");
const Recruiter = require("../models/Recruiter");

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
router.get("/:id/applications", function (req, res) {
    Job.findById(req.params.id).then(job => {
        if (!job) {
            return res.status(404).json({
                error: "Job doesn't exist!",
            });
        }
        else {
            job.populate('applications');
            return res.json(job.applications);
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
                    count: { applications: 0 },
                    limit: req.body.limit,
                    /* TODO: Verify Date format. What is Day-23, Mmonth-June , etc.? */
                    postedOn: Date.now(),
                    deadline: req.body.deadline,
                    /* TODO: Limit to Languages? */
                    skillset: req.body.skillset,
                    /* TODO: Enumerators ? */
                    type: req.body.type,
                    /* TODO: Limit to 1-6 months, and 0 indefinite */
                    duration: req.body.duration,
                    /* TODO: Salary positive check */
                    salary: req.body.salary,
                    /* TODO: Dynamic ..... */
                    rating: 0
                });
                newJob.save(function (err, job) {
                    if (err) {
                        console.log(err);
                        res.status(400);
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


router.post("/edit", (req, res) => {
    const recruiterKey = req.body.recruiterKey;
    const email = req.body.recruiteremail;
    const limit = req.body.limit;
    const deadline = req.body.deadline;

    Job.findOne({ email })
        .then(job => {
            if (!job) {
                return res.status(404).json({
                    error: "Job doesn't exist!",
                });
            }
            else {
                if (job.recruiteremail == email) {
                    Recruiter.findOne({ email: email }).then(owner => {
                        if (!owner) {
                            // How did we get here?
                            res.status(500).json({ error: "This Job doesn't belong to anybody!" });
                        }
                        else {
                            if (owner.password != recruiterKey) {
                                res.status(400).json({ error: "You are not authorised [Wrong Password]!" });
                            }
                            else {
                                job.limit = limit;
                                job.deadline = Date.parse(deadline);

                                job.save(function (err, done) {
                                    if (err) {
                                        res.status(400).json({ error: "Couldn't edit job : " + err });
                                    }
                                    else {
                                        res.status(200).json("Job Listing Updated!");
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
    const recruiterKey = req.body.recruiterKey;
    const email = req.body.recruiteremail;

    Job.findById(req.params.id)
        .then(job => {
            if (job.recruiteremail == email) {
                Recruiter.findOne({ email: email }).then(owner => {
                    if (!owner) {
                        // How did we get here?
                        res.status(500).json({ error: "This Job doesn't belong to anybody!" });
                    }
                    else {
                        if (owner.password != recruiterKey) {
                            res.status(400).json({ error: "You are not authorised [Wrong Password]!" });
                        }
                        else {
                            Recruiter.updateOne({ _id: owner._id }, { $pullAll: { jobs: [job._id] } }).then(() => {
                                try {
                                    job.delete();
                                    res.status(200).json("Job Listing Deleted!");
                                } catch (err) {
                                    res.status(400).json({ error: "Couldn't delete job : " + err });
                                }
                            }).catch(err => {
                                res.status(400).json({ error: "Could not update recruiter!: " + err });
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

