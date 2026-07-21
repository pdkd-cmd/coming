const express = require("express");
const router = express.Router();

const db = require("../database/db");
const upload = require("../middleware/upload");

/* =========================
GET ALL PRODUCTS
========================= */

router.get("/", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
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
  });
});

/* =========================
IMAGE UPLOAD
========================= */

router.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    success: true,
    filename: req.file.filename,
  });
});

/* =========================
ADD PRODUCT
========================= */

router.post("/", (req, res) => {
  const {
    sku,
    name,
    brand,
    description,
    price,
    sale_price,
    stock,
    image,
    category,
  } = req.body;

  db.run(
    `INSERT INTO products
(
sku,
name,
brand,
description,
price,
sale_price,
stock,
image,
category
)
VALUES (?,?,?,?,?,?,?,?,?)`,
    [sku, name, brand, description, price, sale_price, stock, image, category],
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
    },
  );
});

/* =========================
DASHBOARD STATS
========================= */

router.get("/stats/dashboard", (req, res) => {
  db.get("SELECT COUNT(*) as totalProducts FROM products", [], (err, row) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      success: true,
      data: row,
    });
  });
});

/* =========================
FEATURED PRODUCTS
========================= */

router.get("/featured", (req, res) => {
  db.all(
    `SELECT * FROM products
     ORDER BY sale_price ASC
     LIMIT 8`,
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
    },
  );
});

/* =========================
TRENDING PRODUCTS
========================= */

router.get("/trending", (req, res) => {
  db.all(
    `SELECT * FROM products
     ORDER BY id DESC
     LIMIT 8`,
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
    },
  );
});

/* =========================
NEW ARRIVALS
========================= */

router.get("/new", (req, res) => {
  db.all(
    `SELECT * FROM products
     ORDER BY created_at DESC
     LIMIT 8`,
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
    },
  );
});

/* =========================
GET SINGLE PRODUCT
========================= */

router.get("/:id", (req, res) => {
  db.get("SELECT * FROM products WHERE id=?", [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json(row);
  });
});

/* =========================
UPDATE PRODUCT
========================= */

router.put("/:id", (req, res) => {
  const {
    sku,
    name,
    brand,
    description,
    price,
    sale_price,
    stock,
    image,
    category,
  } = req.body;

  db.run(
    `UPDATE products
SET
sku=?,
name=?,
brand=?,
description=?,
price=?,
sale_price=?,
stock=?,
image=?,
category=?
WHERE id=?`,
    [
      sku,
      name,
      brand,
      description,
      price,
      sale_price,
      stock,
      image,
      category,
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
    },
  );
});

/* =========================
UPDATE STOCK
========================= */

router.put("/:id/stock", (req, res) => {
  db.run(
    "UPDATE products SET stock=? WHERE id=?",
    [req.body.stock, req.params.id],
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
    },
  );
});

/* =========================
DELETE PRODUCT
========================= */

router.delete("/:id", (req, res) => {
  db.run("DELETE FROM products WHERE id=?", [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json({
      success: true,
    });
  });
});

// =====================================
// GET PRODUCT VARIANTS
// =====================================

router.get("/:id/variants", (req, res) => {
  db.all(
    "SELECT * FROM variants WHERE product_id=? ORDER BY id ASC",
    [req.params.id],
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
    },
  );
});

// =====================================
// ADD VARIANT
// =====================================

router.post("/:id/variants", (req, res) => {
  const { sku, color, size, stock, price, sale_price } = req.body;

  db.run(
    `INSERT INTO variants
(product_id,sku,color,size,stock,price,sale_price)
VALUES(?,?,?,?,?,?,?)`,

    [req.params.id, sku, color, size, stock, price, sale_price],

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
    },
  );
});

// =====================================
// UPDATE VARIANT
// =====================================

router.put("/variants/:id", (req, res) => {
  const { sku, color, size, stock, price, sale_price } = req.body;

  db.run(
    `UPDATE variants
SET
sku=?,
color=?,
size=?,
stock=?,
price=?,
sale_price=?
WHERE id=?`,

    [sku, color, size, stock, price, sale_price, req.params.id],

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
    },
  );
});

// =====================================
// DELETE VARIANT
// =====================================

router.delete("/variants/:id", (req, res) => {
  db.run(
    "DELETE FROM variants WHERE id=?",

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
    },
  );
});

// =====================================
// GET PRODUCT IMAGES
// =====================================

router.get("/:id/images", (req, res) => {
  db.all(
    "SELECT * FROM product_images WHERE product_id=? ORDER BY sort_order ASC,id ASC",

    [req.params.id],

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
    },
  );
});

// =====================================
// ADD PRODUCT IMAGE
// =====================================

router.post("/:id/images", (req, res) => {
  const {
    image,

    sort_order,
  } = req.body;

  db.run(
    `INSERT INTO product_images
(product_id,image,sort_order)
VALUES(?,?,?)`,

    [req.params.id, image, sort_order || 0],

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
    },
  );
});

// =====================================
// DELETE PRODUCT IMAGE
// =====================================

router.delete("/images/:id", (req, res) => {
  db.run(
    "DELETE FROM product_images WHERE id=?",

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
    },
  );
});

module.exports = router;
