var express = require("express");
var router = express.Router();

// Load User model
const Recruiter = require("../models/Recruiter");
const Jobs = require("../models/Jobs");

// GET request 
// Getting all the users
router.get("/", function (req, res) {
    Recruiter.find(function (err, recruiters) {
        if (err) {
            console.log(err);
        } else {
            res.json(recruiters);
        }
    })
});

// Getting active jobs
/* TODO: Currently returns all jobs, see moodle asked by Mehul */
router.post("/activejobs", function (req, res) {
    Recruiter.findOne({ email: req.body.email}).populate("jobs").then(recruiter => {
        if (!recruiter) {
            return res.status(404).send({
                error: "Invalid Recruiter Email",
            });
        }
        else {
            console.log(recruiter.jobs);
            res.json(recruiter.jobs);
        }
    });
});

// Update recruiter info
router.post("/edit", function (req, res) {
    Recruiter.findOne({ email: req.body.curemail }).then(recruiter => {
        if (!recruiter) {
            return res.status(404).send({
                error: "Email not found",
            });
        }
        else {
            if (recruiter.password != req.body.password) {
                return res.status(401).send({
                    error: "Password Incorrect",
                });
            }
            else {
                recruiter.name = req.body.name
                recruiter.email = req.body.email
                recruiter.password = req.body.password
                recruiter.contact = req.body.contact
                recruiter.bio = req.body.bio

                recruiter.save(function (err, done) {
                    if (err) {
                        return res.status(400).send({ error: "Couldn't edit recruiter : " + err });
                    }
                    else {
                        return res.status(200).send({ error: "Recruiter info Updated!" });
                    }
                })
            }
        }
    });
});



// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

// POST request 
// Add a user to db
router.post("/register", (req, res) => {
    const newRecruiter = new Recruiter({
        name: req.body.name,
        email: req.body.email,
        contact: req.body.contact,
        bio: req.body.bio,
        password: req.body.password,
        /* TODO: Useless date ? */
        date: Date.now()
    });

    newRecruiter.save()
        .then(recruiter => {
            res.status(200).json(recruiter);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// POST request 
// Login
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    Recruiter.findOne({ email }).then(recruiter => {
        // Check if user email exists
        if (!recruiter) {
            return res.status(404).json({
                error: "Email not found",
            });
        }
        else {
            //res.send("Email Found");
            if (recruiter.password != password) {
                res.status(401).send({ error: "Password Incorrect" });
            }
            else {
                /* TODO: cleaner way to delete just one key */
                res.status(200).json({
                    name: recruiter.name,
                    email: recruiter.email,
                    contact: recruiter.contact,
                    bio: recruiter.bio
                });
            }
        }
    });
});

module.exports = router;

