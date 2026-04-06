import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		match: [/.+@.+\..+/, "Must use a valid email address"],
	},
	password: {
		type: String,
		minlength: 5,
		// required: true,
		required: function () {
			// "this" refers to document that is being created
			return !this.githubId;
		},
	},
	githubId: {
		type: String,
		unique: true,
	},
});

// hash user password
userSchema.pre("save", async function () {
	if (this.password && (this.isNew || this.isModified("password"))) {
		const saltRounds = 10;
		this.password = await bcrypt.hash(this.password, saltRounds);
	}
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
