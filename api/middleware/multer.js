const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, path.resolve(__dirname, '../../static'));
	},
	filename: (req, file, cb) => {
		const created = req.body.created;
		cb(null, created + file.originalname);
	},
});
const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'audio/mp3' ||
		file.mimetype === 'audio/mp4' ||
		file.mimetype === 'audio/flac' ||
		file.mimetype === 'audio/wav' ||
		file.mimetype === 'audio/mpeg'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

module.exports = multer({
	storage,
	fileFilter,
	limits: { fileSize: 1024 * 1024 * 10 },
});
