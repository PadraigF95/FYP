const crypto = require ('crypto');
const cloudinary = require ('cloudinary');
cloudinary.config({
    cloud_name: 'dknwgards',

   api_key: '911138879161159',

   api_secret: 's3vmGDUXGst07Pj2rSdeA13VbEo'


});
const cloudinaryStorage = require ('multer-storage-cloudinary');
const storage = cloudinaryStorage({
    cloudinary:cloudinary,
    folder: 'Project',
    allowedFormats:['jpeg', 'jpg', 'png'],
    filename: function(req, file, cb){
        let buf = crypto.randomBytes(16);
        buf = buf.toString('hex');
        let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
        uniqFileName += buf;
        cb(undefined, uniqFileName);
    }
});

module.exports ={

    cloudinary,
    storage
}