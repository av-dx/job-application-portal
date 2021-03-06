const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EducationSchema = new Schema({
  institute: {type: String, required: true, minlength: 1},
  startYear: {type: Number, required: true, min: 1970, max: 2021},
  endYear: {type: Number, required: false, min: 1970, max: 2021},
});

// Create Schema
const ApplicantSchema = new Schema({
  name: {type: String, required: true, minlength: 1},
  email: {type: String, required: true, unique: true, match: /^[\w\-]+(\.[\w\-]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/},
  education: [EducationSchema],
  skills: [String],
  rating: {type: Number, required: false},
  /* TODO: PDFs and Images*/
  resume: {type: String, required: false},
  profilepic: {type: String, required: false},
  _applications: [{type: Schema.Types.ObjectId, ref: 'Application'}],
  password: {type: String, required: true},
  date: {type: Date, required: false},
  doj: {type: Date, required: false},
  isHired: {type: Boolean, required: true},
});

module.exports = Applicant = mongoose.model('Applicants', ApplicantSchema);
