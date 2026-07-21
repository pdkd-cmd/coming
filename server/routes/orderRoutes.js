const express = require("express");
const router = express.Router();

const db = require("../database/db");

// Get All Orders
router.get("/", (req, res) => {
  db.all("SELECT * FROM orders ORDER BY id DESC", [], (err, rows) => {
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

// =====================================
// Get Order By Order ID
// =====================================

router.get("/order/:orderId", (req, res) => {

    db.get(

        "SELECT * FROM orders WHERE order_id=?",

        [req.params.orderId],

        (err, row) => {

            if (err) {

                return res.status(500).json({

                    success: false,

                    error: err.message

                });

            }

            if (!row) {

                return res.json({

                    success: false,

                    message: "Order Not Found"

                });

            }

            res.json({

                success: true,

                data: row

            });

        }

    );

});

// Create Order
router.post("/", (req, res) => {
  const {
    order_id,
    customer_name,
    customer_phone,
    customer_address,
    products,
    total,
  } = req.body;

  db.run(
    `INSERT INTO orders
(order_id,customer_name,customer_phone,customer_address,products,total)
VALUES(?,?,?,?,?,?)`,

    [
      order_id,
      customer_name,
      customer_phone,
      customer_address,
      products,
      total,
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
    },
  );
});

// Update Order Status

router.put("/:id", (req, res) => {

  const { status } = req.body;

  db.run(

    "UPDATE orders SET status=? WHERE id=?",

    [status, req.params.id],

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

router.delete("/:id", (req, res) => {

    db.run(

        "DELETE FROM orders WHERE id=?",

        [req.params.id],

        function(err){

            if(err){

                return res.status(500).json({
                    success:false,
                    error:err.message
                });

            }

            res.json({
                success:true
            });

        }

    );

});

module.exports = router;
