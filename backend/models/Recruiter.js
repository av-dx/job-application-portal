const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const RecruiterSchema = new Schema({
  name: {type: String, required: true, minlength: 1},
  email: {type: String, required: true, unique: true, match: /^[\w\-]+(\.[\w\-]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/},
  contact: {type: String, required: true, match: /^[\+]?[0-9]{10,12}$/},
  bio: {type: String, required: false, match: /^\s*\S+(?:\s+\S+){0,249}\s*$/},
  password: {type: String, required: true},
  date: {type: Date, required: false},
  jobs: [{type: Schema.Types.ObjectId, ref: 'Jobs'}],
  employees: [{_applicant: {type: Schema.Types.ObjectId, ref: 'Applicants'}, _job: {type: Schema.Types.ObjectId, ref: 'Jobs'}, doj: {type: Date, required: true}}],
});

module.exports = Recruiter = mongoose.model('Recruiters', RecruiterSchema);
