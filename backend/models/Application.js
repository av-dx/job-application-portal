const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ApplicationSchema = new Schema({
  _applicant: {type: Schema.Types.ObjectId, ref: 'Applicant', required: true},
  _job: {type: Schema.Types.ObjectId, ref: 'Job', required: true},
  sop: {type: String, match: /^([a-zA-Z]+[\. ]+){0, 250}/},
  status: {type: String, required: true, enum: ['Submitted', 'Shortlisted', 'Accepted', 'Rejected']},
  postedOn: {type: Date, required: true},
});

module.exports = Application = mongoose.model('Application', ApplicationSchema);
