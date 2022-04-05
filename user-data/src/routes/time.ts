const express = require("express");
const router = express.Router();
const moment = require("moment");


 router.get('/api/users/time', (req,res) => {
    let {date} = req.body;
    var localDate = moment().format(); 
    var utcFormat = moment.utc(localDate).format('YYYY-MM-DD HH:mm:ss a');
    console.log('LocalDate: ', localDate);
    console.log('utcFormat: ', utcFormat);
    res.status(200).send(utcFormat);
})


export { router as time };
