const { Router } = require('express');
const router = Router();
const musicController = require('../controllers/musicController');
const upload = require('../middleware/multer');

router.get('/', musicController.getAllMusic);
router.post('/', upload.single('music'), musicController.addNewMusic);
router.put('/:id', musicController.updateMusicById);
router.delete('/:id', musicController.deleteMusicById);

module.exports = router;
