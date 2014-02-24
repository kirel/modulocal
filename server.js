var express = require('express');
var moment = require('moment');
var ical = require('ical-generator');
var app = express();

moment.lang('de'); // make monday start of week

app.get('/', function(req, res){
  req.send('Subscribe to /:modulo/:residual');
});

app.get('/:modulo/:residual', function(req, res){
  res.set('Content-Type', 'text/calendar');
  var cal = ical();
  cal.setDomain('zweitag.de').setName('Küchendienst')
  var current = moment().week() % parseInt(req.params.modulo);
  var start = moment().startOf('year');
  var end = moment().add('y', 1).startOf('year');
  for (var i=1; moment().local().week(i+1).startOf('week') <= end ; i++) {
    if (i%req.params.modulo!=req.params.residual) continue;
    var left = moment().local().week(i).startOf('week');
    var right = moment().local().week(i+1).startOf('week');
    if (left<start) left = start;
    if (right>end) right = end;
    cal.addEvent({
      start: left.toDate(), end: right.toDate(), summary: 'Küchendienst'
    });
  }
  res.send(cal.toString().replace(/T000000/g,''));
});

app.listen(3000);
