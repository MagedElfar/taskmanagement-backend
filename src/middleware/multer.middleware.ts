import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import config from "../config";

const mediaPath = config.mediaPath;

export default class Multer {

  static localUpload() {


    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, mediaPath)
      },
      filename: function (req, file, cb) {
        const filename = `${uuidv4()}-${file.originalname}`
        cb(null, filename)
      }
    })

    return multer({ storage })
  }
}