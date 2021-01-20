var express = require("express");
var router = express.Router();

// Load User model
const Applicant = require("../models/Applicant");

// GET request 
// Getting all the users
router.get("/", function (req, res) {
    Applicant.find(function (err, applicants) {
        if (err) {
            console.log(err);
        } else {
            res.json(applicants);
        }
    });
});

// Getting all applications for an applicant
router.get("/postedapplications", function (req, res) {
    Applicant.findOne({ email: req.body.email }).then(applicant => {
        if (!applicant) {
            return res.status(404).send({
                error: "Email not found",
            });
        }
        else {
            if (applicant.password != req.body.password) {
                return res.status(401).send({
                    error: "Password Incorrect",
                });
            }
            else {
                applicant.populate('applications')
                res.json(applicant.applications);
            }
        }
    });
});

// Update applicant info
router.post("/edit", function (req, res) {
    Applicant.findOne({ email: req.body.curemail }).then(applicant => {
        if (!applicant) {
            return res.status(404).send({
                error: "Email not found",
            });
        }
        else {
            if (applicant.password != req.body.password) {
                return res.status(401).send({
                    error: "Password Incorrect",
                });
            }
            else {
                applicant.name = req.body.name
                applicant.email = req.body.email
                applicant.password = req.body.password
                applicant.skills = req.body.skills
                applicant.education = req.body.education

                applicant.save(function (err, done) {
                    if (err) {
                        return res.status(400).send({ error: "Couldn't edit applicant : " + err });
                    }
                    else {
                        return res.status(200).send({ error: "Applicant info Updated!" });
                    }
                })
            }
        }
    });
});

/* TODO: Get consistency on password, applicantKey, etc conventions */
// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

// POST request 
// Add a user to db
router.post("/register", (req, res) => {
    const newApplicant = new Applicant({
        name: req.body.name,
        email: req.body.email,
        education: req.body.education,
        skills: req.body.skills,
        rating: 0,
        resume: [],
        profilepic: '',
        password: req.body.password,
        /* TODO: Useless date ? */
        date: Date.now()
    });

    newApplicant.save()
        .then(applicant => {
            res.status(200).json(applicant);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

/* TODO: Make all auth with hashKey + user _ids */
// POST request 
// Login
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    Applicant.findOne({ email }).then(applicant => {
        // Check if user email exists
        if (!applicant) {
            return res.status(404).send({
                error: "Email not found",
            });
        }
        else {
            //res.send("Email Found");
            if (applicant.password != password) {
                res.status(401).send({ error: "Password Incorrect" });
            }
            else {
                /* TODO: cleaner way to delete just one key */
                res.status(200).json({
                    name: applicant.name,
                    email: applicant.email,
                    education: applicant.education,
                    skills: applicant.skills,
                    rating: applicant.rating,
                    resume: applicant.resume,
                    profilepic: applicant.profilepic
                });
            }
        }
    });
});

module.exports = router;