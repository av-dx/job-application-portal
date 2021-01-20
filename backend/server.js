const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
const DB_NAME = "jobportal"

// routes
var testAPIRouter = require("./routes/testAPI");
var UserRouter = require("./routes/Users");
var ApplicantRouter = require("./routes/Applicant");
var RecruiterRouter = require("./routes/Recruiter");
var JobRouter = require("./routes/Jobs");
var ApplicationRouter = require("./routes/Application");


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/' + DB_NAME, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully !");
})

// setup API endpoints
app.use("/testAPI", testAPIRouter);
app.use("/user", UserRouter);
app.use("/applicant", ApplicantRouter);
app.use("/application", ApplicationRouter);
app.use("/recruiter", RecruiterRouter);
app.use("/job", JobRouter);


app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
