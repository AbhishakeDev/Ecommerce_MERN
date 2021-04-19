import express from 'express';
import multer from 'multer';
import path from 'path';
import { nextTick } from 'process';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

//function for filtering extension types to only jpeg,jpg,png
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images Only');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
})

const errorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(400)
    }
    next(err);
}

router.post('/', upload.single('image'), errorHandler, (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please select a file');
    }
    res.send(`/${req.file.path}`)
})

export default router