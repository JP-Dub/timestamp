// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var obj = {
    "unix" : "", "natural" : ""
};

app.use('/public', express.static(process.cwd() + '/public'));


app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


app.get('/:time', function(req, res) {
    var date = req.params.time;
    var isNum = date.match(/^\d{1,}$/g);
 
    function convertTime(time) {
        var regex = /(\w{3}\s\d{2})(\s\d{4})/gi;
        var natural = time.match(regex).toString().replace(regex, "$1,$2");     
        obj.natural = natural;
        return natural;
    }  
    
    if(isNum) {
      var unix = Number(date);
    }
    var natural = date;
    
    if(unix) {
        obj.unix = unix;
        natural = new Date(unix*1000).toString();
        convertTime(natural);
        res.json(obj);
    } 
 
    if(!unix) {
        var time = new Date(date).toString();
        if(time === "Invalid Date") {
            obj.natural = "null";
            obj.unix = "null";
            res.json(obj);
        } else {
            time = convertTime(time);
            unix = Date.parse(time)/1000;
            obj.unix = unix;
            res.json(obj);
        }
    }
    
});

/*
// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];
*/
// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
