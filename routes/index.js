var express = require('express');
var router  = express.Router();
var line    = require('@line/bot-sdk');
var client  = new line.Client({
  channelAccessToken: '<AccessToken>'
});

router.post('/line', function(req, res, next) {
  res.status(200).end;
  res.json({ webhook: 'called!' })

  client.replyMessage(req.body.events[0].replyToken,{
    type: 'text',
    text: req.body.events[0].message.text
  })
    .then(() => {
      console.log("success");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
