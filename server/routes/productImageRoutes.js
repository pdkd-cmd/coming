const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const db = require("../database/db");

// Get Images
router.get("/:productId", (req, res) => {

    db.all(

        `SELECT *
         FROM product_images
         WHERE product_id=?
         ORDER BY sort_order,id`,

        [req.params.productId],

        (err, rows) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    error: err.message
                });

            }

            res.json({
                success: true,
                data: rows
            });

        }

    );

});

// Delete Image
router.delete("/:id", (req, res) => {

    db.run(

        "DELETE FROM product_images WHERE id=?",

        [req.params.id],

        function (err) {

            if (err) {

                return res.status(500).json({
                    success: false,
                    error: err.message
                });

            }

            res.json({
                success: true
            });

        }

    );

});

// Upload Images
router.post(
    "/upload/:productId",
    upload.single("image"),
    (req, res) => {

        if (!req.file) {

            return res.status(400).json({
                success:false
            });

        }

        db.run(

            `INSERT INTO product_images
            (product_id,image)
            VALUES(?,?)`,

            [
                req.params.productId,
                req.file.filename
            ],

            function(err){

                if(err){

                    return res.status(500).json({
                        success:false,
                        error:err.message
                    });

                }

                res.json({

                    success:true,

                    id:this.lastID,

                    image:req.file.filename

                });

            }

        );

    }
);

module.exports = router;