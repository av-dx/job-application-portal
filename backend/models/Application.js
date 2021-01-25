const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ApplicationSchema = new Schema({
  _applicant: {type: Schema.Types.ObjectId, ref: 'Applicants', required: true},
  _job: {type: Schema.Types.ObjectId, ref: 'Job', required: true},
  sop: {type: String, match: /^\s*\S+(?:\s+\S+){0,249}\s*$/},
  status: {type: String, required: true, enum: ['Submitted', 'Shortlisted', 'Accepted', 'Rejected']},
  postedOn: {type: Date, required: true},
  doj: {type: Date, required: false},
});

module.exports = Application = mongoose.model('Application', ApplicationSchema);
