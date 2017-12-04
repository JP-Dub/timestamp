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
    var date = req.params.time; //returns the search parameter
    var unix = Number(date.match(/^\d{1,}$/g)); // verifies string is a number and returns the number
    var natural;
     
    // converts "time" string to month, day and year
    function convertTime(time) {
        var regex = /(\w{3}\s\d{2})(\s\d{4})/gi; 
        natural = time.match(regex).toString().replace(regex, "$1,$2");
        obj.natural = natural;
        return natural;
    }  
    
    if(unix) {
        obj.unix = unix;
        natural = new Date(unix*1000).toString();
        convertTime(natural);
        res.json(obj);
    } 
 
    if(!unix) {
        var reg = /([a-z]{3,9})(.?\s*)(\d{1,2})(st|nd|rd|th)(,?)(\s*)(('?|\s)\d{1,4})/gi;// identifies various written time formats
        if (date.match(reg)) {
            date = date.replace(reg, "$1$2$3$5$6$7"); //returns a date format valid for new Date obj
        }
        var time = new Date(date).toString();
        if(time === "Invalid Date") { // if the string passed is neither a date or a number, "null" is returned to the user
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
