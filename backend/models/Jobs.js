const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const JobSchema = new Schema({
  title: {type: String, required: true, minlength: 1},
  _recruiter: {type: Schema.Types.ObjectId, ref: 'Recruiters', required: true},
  count: {
    applications: {type: Number, required: true, min: 0},
    positions: {type: Number, required: true, min: 0},
  },
  limit: {
    applications: {type: Number, required: true, min: 0},
    positions: {type: Number, required: true, min: 0},
  },
  postedOn: {type: Date, required: true},
  deadline: {type: Date, required: true},
  skillset: [String],
  type: {type: String, required: true, enum: ['Full-Time', 'Part-Time', 'WFH']},
  duration: {type: Number, required: true, min: 0, max: 6},
  salary: {type: Number, required: true, min: 0},
  rating: {type: Number, required: true, min: 0},
  ratedBy: {type: Number, required: true, min: 0},
  applications: [{type: Schema.Types.ObjectId, ref: 'Application'}],
  active: {type: Boolean, required: true},
});

module.exports = Job = mongoose.model('Jobs', JobSchema);
