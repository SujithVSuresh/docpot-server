import { Router } from "express";
import docController from "../controllers/docController.js";
import multer from 'multer';


const docRouter = Router()


const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

docRouter.post('/', upload.single('document'), docController.docProcessor)
docRouter.get('/', docController.searchChunks)

export default docRouter