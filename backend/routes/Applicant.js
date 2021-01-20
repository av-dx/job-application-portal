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
router.get("/:id/applications", function (req, res) {
    Applicant.findOne({ _id: req.params.id }).populate('applications').then(applicant => {
        if (!applicant) {
            return res.status(404).json({
                error: "Invalid Applicant Email",
            });
        }
        else {
            if (applicant.password != req.body.applicantKey) {
                res.send("Password Incorrect");
            }
            else {
                res.json(applicant.applications);
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