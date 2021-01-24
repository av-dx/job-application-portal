const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const RecruiterSchema = new Schema({
  name: {type: String, required: true, minlength: 1},
  email: {type: String, required: true, unique: true, match: /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/},
  contact: {type: String, required: true, match: /^[\+]?[0-9]{10,12}$/},
  bio: {type: String, required: false, match: /^([a-zA-Z]+[\. ]+){0, 250}/},
  password: {type: String, required: true},
  date: {type: Date, required: false},
  jobs: [{type: Schema.Types.ObjectId, ref: 'Jobs'}],
  employees: [{_applicant: {type: Schema.Types.ObjectId, ref: 'Applicants'}, _job: {type: Schema.Types.ObjectId, ref: 'Jobs'}, doj: {type: Date, required: true}}],
});

module.exports = Recruiter = mongoose.model('Recruiters', RecruiterSchema);
