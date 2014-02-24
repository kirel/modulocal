var express = require('express');
var moment = require('moment');
var ical = require('ical-generator');
var app = express();

moment.lang('de'); // make monday start of week

app.get('/', function(req, res){
  res.send('Subscribe to /:modulo/:residual?topic=topic i.e. <a href="http://modulocal.herokuapp.com/5/4?topic=Küchendienst">http://modulocal.herokuapp.com/5/4?topic=Küchendienst</a>.');
});

app.get('/:modulo/:residual', function(req, res){
  var mod = parseInt(req.params.modulo);
  var rem = parseInt(req.params.residual);
  if(isNaN(mod)||isNaN(rem)) return res.send(400);
  res.set('Content-Type', 'text/calendar');
  var topic = req.query.topic || 'My turn';
  var cal = ical();
  cal.setDomain('zweitag.de').setName(topic)
  var current = moment().week() % mod;
  var start = moment().startOf('year');
  var end = moment().add('y', 1).startOf('year');
  for (var i=1; moment().week(i+1).startOf('week') <= end ; i++) {
    if (i%mod!=rem) continue;
    var left = moment().week(i).startOf('week');
    var right = moment().week(i+1).startOf('week');
    if (left<start) left = start;
    if (right>end) right = end;
    cal.addEvent({
      start: left.toDate(), end: right.toDate(), summary: topic
    });
  }
  res.send(cal.toString().replace(/T000000/g,''));
});

app.listen(process.env.PORT || 3000);
