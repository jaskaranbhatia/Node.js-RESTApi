const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.json({
        questions: "question Success"
    })
});

module.exports = router;