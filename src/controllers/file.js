const multer = require("multer");
const uuid = require("uuid");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
module.exports = new (class extends controller {
  async createFile(req, res) {
    let fileName = {};
    let message;
    let status;
    const fileUpload = multer({
      limits: 500000,
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "uploads/images");
        },
        filename: (req, file, cb) => {
          const ext = MIME_TYPE_MAP[file.mimetype];
          cb(null, uuid() + "." + ext);
        },
      }),
      fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error("Invalid mime type!");
        cb(error, isValid);
      },
    }).single("image");

    await fileUpload(req, res, (err) => {
      if (err) {
        console.log(err);
        status = 500;
        message = "آپلود ناموفق بود ، احتمالا مشکلی از سمت سرور رخ داده است";
      } else {
        message = "آپلود فایل با موفقیت انجام شد";
        fileName = req.file.filename;
      }
    });

    this.response({
      res,
      message,
      data: fileName,
      code: status,
    });
  }
})();
