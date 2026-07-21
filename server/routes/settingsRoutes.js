const express = require("express");
const router = express.Router();

const db = require("../database/db");

/* =========================
GET SETTINGS
========================= */

router.get("/", (req, res) => {
  db.get(
    "SELECT * FROM settings WHERE id=1",

    [],

    (err, row) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.json({
        success: true,
        data: row,
      });
    },
  );
});

/* =========================
UPDATE SETTINGS
========================= */

router.put("/", (req, res) => {
  const {
    store_name,
    phone,
    email,
    address,
    telegram_username,
    whatsapp,
    instagram,
    facebook,
    youtube,
    footer_text,
    logo,
  } = req.body;

  db.run(
    `UPDATE settings
SET

store_name=?,
phone=?,
email=?,
address=?,
telegram_username=?,
whatsapp=?,
instagram=?,
facebook=?,
youtube=?,
footer_text=?,
logo=?

WHERE id=1`,

    [
      store_name,
      phone,
      email,
      address,
      telegram_username,
      whatsapp,
      instagram,
      facebook,
      youtube,
      footer_text,
      logo,
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

module.exports = router;
