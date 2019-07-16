const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')
const _ = require('lodash')

// set storage engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single("mobileImage");

// check file type
function checkFileType(file,cb){
  // allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  }else{
    cb('Error: Images Only!');
  }
}
// init app
const app = express()
const port = 3005

// EJS
app.set('view engine', 'ejs')

// public folder
app.use(express.static('./public'))

app.get('/', (req,res) => res.render('index'))

app.post('/upload', (req,res) => {
  upload(req, res, function(error) {
    if(error) {
      res.render('index', {
        msg: error
      });
     } else {
        if(req.file == undefined) {
          res.render('index', {
            msg: 'Error: No File Selected'
          });
       } else {
          res.render('index', {
            msg: 'File Uploaded',
            file: `uploads/${req.file.filename}`
          });
        }
      }
    })
  })

app.listen(port, () => console.log(`server started on port ${port}`))