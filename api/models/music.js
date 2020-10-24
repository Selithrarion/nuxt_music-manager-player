const { Schema, model } = require('mongoose');

const musicSchema = Schema({
	title: {
		type: String,
		required: true,
	},
	music: {
		type: Object,
		required: true,
	},
	author: {
		type: String,
		required: true,
	},
	stars: {
		type: Number,
		required: true,
	},
	created: {
		type: String,
		required: true,
	},
	howl: {
		type: Object,
		default: null,
	},
	originalFileName: {
		type: String,
		required: true,
	},
});

module.exports = model('musics', musicSchema);
