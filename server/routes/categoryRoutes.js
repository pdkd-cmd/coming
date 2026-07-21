const express = require("express");
const router = express.Router();

const db = require("../database/db");
const upload = require("../middleware/upload");

router.get("/", (req, res) => {
  db.all("SELECT * FROM categories", [], (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      success: true,
      data: rows,
    });
  });
});

// Upload Category Image
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image uploaded",
    });
  }

  res.json({
    success: true,
    filename: req.file.filename,
  });
});

router.post("/", (req, res) => {
  const { name, slug, image } = req.body;

  db.run(
    "INSERT INTO categories(name,slug,image) VALUES(?,?,?)",

    [name, slug, image],

    function (err) {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        success: true,
        id: this.lastID,
      });
    },
  );
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM categories WHERE id=?", [id], function (err) {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      success: true,
    });
  });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;

  const { name, slug, image } = req.body;

  db.run(
    "UPDATE categories SET name=?, slug=?, image=? WHERE id=?",

    [name, slug, image, id],

    function (err) {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        success: true,
      });
    },
  );
});

module.exports = router;
