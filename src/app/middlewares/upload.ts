import multer from 'multer'
// import fs from 'fs'
import path from 'path'

// const dir = './Public'

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    let dest = './public'
    if (file.mimetype.includes('image')) {
      if (file.fieldname == 'thumbnail') dest += '/images/courses'
    }

    callback(null, dest)
  },
  filename: function (req, file, callback) {
    callback(
			null,
			"/" + path.basename(file.originalname, path.extname(file.originalname))
		);
  },
})

export const upload = multer({
  limits: {
    fileSize: 5242880,
  },
  storage: storage,
})
