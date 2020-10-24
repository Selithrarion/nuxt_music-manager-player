const Music = require('../models/music');
const fs = require('fs');
const path = require('path');

module.exports.getAllMusic = async (req, res) => {
	try {
		const music = await Music.find();
		res.status(200).json(music);
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

module.exports.addNewMusic = async (req, res) => {
	try {
		const music = new Music({
			title: req.body.title,
			author: req.body.author,
			created: req.body.created,
			stars: req.body.stars,
			originalFileName: req.body.originalFileName,
			music: req.file,
		});

		await music.save();

		res.status(201).json({ data: music });
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

module.exports.updateMusicById = async (req, res) => {
	const $set = {
		title: req.body.title,
		author: req.body.author,
		stars: req.body.stars,
	};
	try {
		const music = await Music.findOneAndUpdate(
			{ _id: req.params.id },
			{ $set },
			{ new: true }
		);
		res.json(music);
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

module.exports.deleteMusicById = async (req, res) => {
	try {
		const id = req.params.id;
		const music = await Music.findOne({ _id: id });
		const data = await Music.deleteOne({ _id: id });

		try {
			fs.unlinkSync(
				path.resolve(
					__dirname,
					'../../static/' + music.created + music.originalFileName
				)
			);
		} catch (err) {
			console.error(err);
		}

		res.json(data);
	} catch (err) {
		res.status(500).json({ message: err });
	}
};
