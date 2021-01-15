const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ApplicationSchema = new Schema({
	//_recruiter: { type: Schema.Types.ObjectId, ref: 'Recruiter', required: true },
	_applicant: { type: Schema.Types.ObjectId, ref: 'Applicant', required: true },
	_job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
	/* TODO: They said 250 WORDS not letters ! */
	sop: { type: String, maxlength: 250 },
	/* TODO: Change to 3-state enum */
	status: { type: String, required: true },
	/* TODO: Better define stage */
	// stage: { type: String, required: true },
	/* TODO: Set date automatically to applying date */
	postedOn: { type: Date, required: true }
});

module.exports = Application = mongoose.model("Applications", ApplicationSchema);
