const multer = require('multer');
const Datauri = require('datauri');
const path = require('path');
const storage = multer.memoryStorage();
const multerUploads = multer({
    storage,
    fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new multer.MulterError(400, 'Only images are allowed'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: 1024 * 1024 * 15
    }
}).single('image');
const dUri = new Datauri();


/**
 * @description This function converts the buffer to data url
 * @param {Object} req containing the field object
 * @returns {String} The data url from the string buffer
 */
const dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
module.exports ={ multerUploads, dataUri };