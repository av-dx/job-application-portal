const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const RecruiterSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	contact: { type: String, required: true },
	bio: { type: String, required: false, maxlength: 250 },
	password: { type: String, required: true },
	date: { type: Date, required: false },
	jobs: [{ type: Schema.Types.ObjectId, ref: 'Jobs' }],
	employees: [{ type: Schema.Types.ObjectId, ref: 'Applicants' }]
});

module.exports = Recruiter = mongoose.model("Recruiters", RecruiterSchema);
