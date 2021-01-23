const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const JobSchema = new Schema({
	title: { type: String, required: true },
	recruitername: { type: String, required: true },
	/* TODO: Email integrity check? */
	recruiteremail: { type: String, required: true },
	count: {
		applications: { type: Number, required: true },
		positions: {type: Number, required: true}
	},
	limit: {
		applications: { type: Number, required: true },
		positions: { type: Number, required: true }
	},
	/* TODO: Verify Date format. What is Day-23, Mmonth-June , etc.? */
	postedOn: { type: Date, required: true },
	deadline: { type: Date, required: true },
	/* TODO: Limit to Languages? */
	skillset: [String],
	/* TODO: Enumerators ? */
	type: { type: String, required: true },
	/* TODO: Limit to 1-6 months, and 0 indefinite */
	duration: { type: Number, required: true },
	/* TODO: Salary positive check */
	salary: { type: Number, required: true },
	/* TODO: Dynamic ..... */
	rating: { type: Number, required: false },
	applications: [{ type: Schema.Types.ObjectId, ref: 'Application' }]
});

module.exports = Job = mongoose.model("Jobs", JobSchema);
