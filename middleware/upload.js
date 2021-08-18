import multer from 'multer'

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads');
  },

  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const imageFileFilter = (req, file, cb) => {
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('You can upload only image files!'), false);
  }
  cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFileFilter }).array('files', 4)

export default upload