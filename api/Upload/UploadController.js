const {dataUri} = require("../../middleware/multer");
const {uploader} = require("../../config/cloudinaryConfig");


/*  @POST /upload
 *  ACCESS : User
 *  upload images */
const upload = (req, res) => {
    if (req.file) {
        const file = dataUri(req).content;
        console.log(file);
        return uploader.upload(file).then((result) => {
            const image = result.url;
            console.log(result);
            return res.status(200).json({
                message: 'Your image has been uploaded successfully to cloudinary',
                data: {
                    image
                }
            })
        }).catch((err) => res.status(400).json({
            message: 'something went wrong while processing your request',
            data: {
                err
            }
        }))
    }else {
        return res.status(400).json({
            message: 'file not found',
        });
    }
};

module.exports = {upload};