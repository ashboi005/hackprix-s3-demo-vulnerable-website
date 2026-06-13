const express = require("express");
const { listRecords, getRecordById, createRecord } = require("../controllers/recordController");

const router = express.Router();

router.get("/", listRecords);
router.get("/:id  ", getRecordById);
router.post("/", createRecord);

module.exports = router;
