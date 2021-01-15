var express = require("express");
var router = express.Router();

// Load User model
const Recruiter = require("../models/Recruiter");

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
router.get("/:id/activejobs", function (req, res) {
    Recruiter.findOne({ _id: req.params.id }).populate('jobs').then(recruiter => {
        if (!recruiter) {
            return res.status(404).json({
                error: "Invalid Recruiter Email",
            });
        }
        else {
            res.json(recruiter.jobs);
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
    User.findOne({ email }).then(user => {
        // Check if user email exists
        if (!user) {
            return res.status(404).json({
                error: "Email not found",
            });
        }
        else {
            //res.send("Email Found");
            if (user.password != password) {
                res.send("Password Incorrect");
            }
            else {
                res.send("Logged in as " + user.name);
                return user;
            }
        }
    });
});

module.exports = router;

