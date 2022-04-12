import express from "express";
const request = require('request');

const router = express.Router();

router.post("/api/sms", async (req, res) => {

  const options = {
    url: 'https://stagingsms.useboom.net/api/v1/message/send',
    json: true,
    headers: {
        'authorization': `${req.headers['authorization']}`
    },
    body: req.body
  };

  request.post(options, (err, response, body) => {
    err ? res.send(err) : res.send(body);
  });
});

export { router as sendSmsRouter };