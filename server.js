// init project
var express = require('express');
var app = express();
var obj = {
    "unix" : "", "natural" : ""
};
// allows access to the /public folder
app.use('/public', express.static(process.cwd() + '/public'));

// posts the index.html to the webpage
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// gets the search parameters and returns either "null" or the "unix/natural" timestamp
app.get('/:time', function(req, res) {
    var date = req.params.time;
    //var isNum = date.match(/^\d{1,}$/g);
    var unix = Number(date.match(/^\d{1,}$/g));
    var natural = date;
     
    function convertTime(time) {
        var regex = /(\w{3}\s\d{2})(\s\d{4})/gi;
        natural = time.match(regex).toString().replace(regex, "$1,$2");     
        obj.natural = natural;
        return natural;
    }  
    //converts string to a number
  /*  
  if(isNum) {
      var unix = Number(date);
    }
    var natural = date;
    */
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

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
