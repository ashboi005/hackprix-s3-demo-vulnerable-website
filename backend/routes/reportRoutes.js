const express = require("express");
const { listReports, createReport, deleteReport } = require("../controllers/reportController");

let multer = null;
try {
  multer = require("multer");
} catch (error) {
  multer = null;
}

const upload = multer ? multer({ dest: "uploads/" }) : { single: () => (req, res, next) => next() };
const router = express.Router();

router.get("/", listReports);
router.post("/", upload.single("file"), createReport);
router.delete("/:id", deleteReport);

module.exports = router;
