var express = require("express");
var router = express.Router();

// Load User model
const Application = require("../models/Application");
const Applicant = require("../models/Applicant");
const Jobs = require("../models/Jobs");

// GET request 
// Getting all the users
router.get("/", function (req, res) {
    Application.find(function (err, applications) {
        if (err) {
            console.log(err);
        } else {
            res.json(applications);
        }
    });
});

// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

router.post("/postapplication", (req, res) => {
    const jobid = req.body.jobid;
    const email = req.body.applicantemail;
    const applicantKey = req.body.applicantKey;
    Jobs.findOne({ _id: jobid }).then(job => {
        if (!job) {
            return res.status(404).json({
                error: "Job doesn't exist!",
            });
        }
    });
    Applicant.findOne({ email: email }).then(applicant => {
        // Check if user email exists
        if (!applicant) {
            return res.status(404).json({
                error: "Applicant doesn't exist!",
            });
        }
        else {
            //res.send("Email Found");
            if (applicant.password != applicantKey) {
                return res.status(404).json({
                    error: "Incorrect Password!",
                });
            }
            else {
                const newApplication = new Application({
                    _applicant: applicant._id,
                    _job: jobid,
                    //_recruiter: job.
                    sop: req.body.sop,
                    status: "Submitted",
                    /* TODO: Verify Date format. What is Day-23, Mmonth-June , etc.? */
                    postedOn: Date.now()
                });
                newApplication.save(function (err, appl) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        applicant.applications.push(appl._id);
                        applicant.save();
                        res.status(200).json(appl);
                    }
                });
            }
        }
    });
});

module.exports = router;

