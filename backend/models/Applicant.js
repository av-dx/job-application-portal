const mongoose = require("mongoose");
const Application = require("./Application");
const Schema = mongoose.Schema;

const EducationSchema = new Schema({
	institute: { type: String, required: true },
	/* TODO: Restrict years to 4 digit ? 
	   TODO: Greater than > check */
	startYear: { type: Number, required: true },
	endYear: { type: Number, required: false }
});

// Create Schema
const ApplicantSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	education: [EducationSchema],
	skills: [String],
	rating: { type: Number, required: false },
	/* TODO: PDFs and Images*/
	resume: [String],
	profilepic: { type: String, required: false },
	applications: [{ type: Schema.Types.ObjectId, ref: 'Application'}],
	password: { type: String, required: true },
	date: { type: Date, required: false }
});

module.exports = Applicant = mongoose.model("Applicants", ApplicantSchema);
