const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const db = require("../database/db");

// Upload Folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/banners");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
});

// ===============================
// GET ALL BANNERS
// ===============================

router.get("/", (req, res) => {
  db.all(
    "SELECT * FROM banners ORDER BY id DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.json({
        success: true,
        data: rows,
      });
    }
  );
});

// ===============================
// UPLOAD IMAGE
// ===============================

router.post(
  "/upload",
  upload.single("image"),
  (req, res) => {

    if (!req.file) {
      return res.status(400).json({
        success: false,
      });
    }

    res.json({
      success: true,
      filename: req.file.filename,
    });

  }
);

// ===============================
// CREATE BANNER
// ===============================

router.post("/", (req, res) => {

  const {
    title,
    subtitle,
    button_text,
    button_link,
    image,
    status,
  } = req.body;

  db.run(
    `INSERT INTO banners
(title,subtitle,button_text,button_link,image,status)
VALUES(?,?,?,?,?,?)`,

    [
      title,
      subtitle,
      button_text,
      button_link,
      image,
      status,
    ],

    function (err) {

      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.json({
        success: true,
        id: this.lastID,
      });

    }
  );

});

// ===============================
// UPDATE BANNER
// ===============================

router.put("/:id", (req, res) => {
  const {
    title,
    subtitle,
    button_text,
    button_link,
    image,
    status,
  } = req.body;

  db.run(
    `UPDATE banners
SET
title=?,
subtitle=?,
button_text=?,
button_link=?,
image=?,
status=?
WHERE id=?`,
    [
      title,
      subtitle,
      button_text,
      button_link,
      image,
      status,
      req.params.id,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.json({
        success: true,
      });
    }
  );
});

// ===============================
// DELETE BANNER
// ===============================

router.delete("/:id", (req, res) => {
  db.run(
    "DELETE FROM banners WHERE id=?",
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.json({
        success: true,
      });
    }
  );
});

module.exports = router;