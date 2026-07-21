const express = require("express");

const router = express.Router();

const db = require("../database/db");

router.get("/", (req, res) => {
  db.get(
    `SELECT
(SELECT COUNT(*) FROM products) AS products,
(SELECT COUNT(*) FROM orders) AS orders,
(SELECT COUNT(*) FROM orders WHERE status='Pending') AS pending,
(SELECT IFNULL(SUM(total),0) FROM orders) AS revenue
`,

    (err, row) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(row);
    },
  );
});

module.exports = router;
