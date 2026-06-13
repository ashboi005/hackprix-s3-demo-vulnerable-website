const express = require("express");
const { listRecords, getRecordById, createRecord, updateRecord, deleteRecord } = require("../controllers/recordController");

const router = express.Router();

router.get("/", listRecords);
router.post("/", createRecord);
router.get("/:id", getRecordById);
router.put("/:id", updateRecord);
router.delete("/:id", deleteRecord);

module.exports = router;
