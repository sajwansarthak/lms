import multer from 'multer';

const storage = multer.diskStorage({});

const upload = multer({storage})


export default upload

// When a user uploads files (like images, PDFs, videos) through a form, the data is sent as multipart/form-data — which Express cannot handle by default.

// 👉 Multer parses this data and makes the files easily accessible in your backend.