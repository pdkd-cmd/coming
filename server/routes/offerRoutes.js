const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Get Active Offers
router.get("/", (req, res) => {

    db.all(
        "SELECT * FROM offers WHERE status=1 ORDER BY id DESC",
        [],
        (err, rows) => {

            if(err){
                return res.status(500).json({
                    success:false,
                    error:err.message
                });
            }

            res.json({
                success:true,
                data:rows
            });

        }
    );

});

// Add Offer
router.post("/", (req,res)=>{

    const {
        title,
        subtitle,
        discount,
        button_text,
        button_link
    } = req.body;

    db.run(

        `INSERT INTO offers
        (title,subtitle,discount,button_text,button_link)
        VALUES(?,?,?,?,?)`,

        [
            title,
            subtitle,
            discount,
            button_text,
            button_link
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
                id:this.lastID
            });

        }

    );

});

module.exports = router;