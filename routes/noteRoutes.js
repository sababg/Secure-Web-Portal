import express from "express";

const router = express.Router();

import Note from "../models/Notes.js";
import { authMiddleware } from "../utils/auth.js";


// apply authMiddleware to all routes in this file
router.use(authMiddleware);

// GET /api/notes - Get ALL notes for the logged-in user
router.get("/", async (req, res) => {
	try {
		// const notes = await Note.find({}).populate('user'); // all docs/notes > each note, replace user field with user's full details
		const notes = await Note.find({ user: req.user._id }); // find/show just notes owned by the logged-in user
		res.json(notes);
	} catch (err) {
		res.status(500).json(err);
	}
});

// GET /api/notes/:id - single note
router.get("/:id", async (req, res) => {
	const note = await Note.findById(req.params.id);
	if (!note) {
		return res.status(404).json({ message: "No note found with this id!" });
	}

	if (note.user.toString() !== req.user._id) {
		return res.status(403).json({ message: "User is not authorized to read this note." });
	}

	res.json(note);
});

// POST /api/notes - Create a new note
router.post("/", async (req, res) => {
	try {
		const note = await Note.create({
			...req.body,
			user: req.user._id, // new note > attaches logged-in user's id
		});
		res.status(201).json(note);
	} catch (err) {
		res.status(400).json(err);
	}
});

// PUT /api/notes/:id - Update a note
router.put("/:id", async (req, res) => {
	try {
		// find note by id
		const note = await Note.findById(req.params.id);
		if (!note) {
			return res.status(404).json({ message: "No note found with this id!" });
		}

		// ownership/authorization check
		if (note.user.toString() !== req.user._id) {
			return res.status(403).json({ message: "User is not authorized to update this note." });
		}

		// perform update
		const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
		res.json(updatedNote);
	} catch (err) {
		res.status(500).json(err);
	}
});

// DELETE /api/notes/:id - Delete a note
router.delete("/:id", async (req, res) => {
	try {
		// find the note by id
		// const note = await Note.findByIdAndDelete(req.params.id);
		const note = await Note.findById(req.params.id);
		if (!note) {
			return res.status(404).json({ message: "No note found with this id!" });
		}

		// ownership/authorization check
		if (note.user.toString() !== req.user._id) {
			return res.status(403).json({ message: "User is not authorized to delete this note." });
		}

		// delete if authorized
		await note.deleteOne();

		res.json({ message: "Note deleted!" });
	} catch (err) {
		res.status(500).json(err);
	}
});

export default router;
