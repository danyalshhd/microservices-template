const express = require("express");
const router = express.Router();
const moment = require("moment");



 router.get('/api/users/time', (req,res) => {
    // let currentDate = new Date();
    // let utcStart = new momentJS (currentDate, "YYYY-MM-DDTHH:mm").utc();
    // console.log(currentDate);
    // res.send(utcStart.format());

    var date = moment.utc().format();
    console.log(date, "- now in UTC"); 

    var local = moment.utc(date).local().format();
    console.log(local, "- UTC now to local"); 

    res.send(date);
})


export { router as time };