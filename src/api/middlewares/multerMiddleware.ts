import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/musics');
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.originalname);
    },
});

const fileFilter = function (req, file, cb) {
    if (file.mimetype === 'audio/mpeg') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only MP3 files are allowed!'));
    }
};

export const multerMiddleware = multer({ storage: storage, fileFilter: fileFilter }).single('audio');
