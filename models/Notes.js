import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},
	content: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	// new field > store/associate the ObjectId of the user who created note
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

const Note = mongoose.model("Note", noteSchema);
export default Note;
