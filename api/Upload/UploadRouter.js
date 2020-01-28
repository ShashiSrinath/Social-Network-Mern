const router = require('express').Router();
const {multerUploads} = require("../../middleware/multer");
const uploadController = require('./UploadController');

router.post('/', multerUploads , uploadController.upload);

module.exports = router;