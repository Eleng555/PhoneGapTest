var app = require("express")();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
	res.send("Hello");
});
app.post("/upload", function(req, res) {
	console.log(req.body);
	res.send("success");
});

app.set("host", "0.0.0.0");
app.listen(1337);
fs=require('fs');
fs.writeFile("data.txt", req, function(err){
	if (err) return console.log(err);
});

/*var fs = require('fs');
function appendObject(obj){
  var configFile = fs.readFileSync('./config.json');
  var config = JSON.parse(configFile);
  config.push(obj);
  var configJSON = JSON.stringify(config);
  fs.writeFileSync('./config.json', configJSON);
}

appendObject({OnetimeCode : WEAS_Server_NewOneTimeCode});
*/
var fs = require('fs')
var fileName = './data.text'
var file = require(fileName)

file.key = "new value"

fs.writeFile(fileName, JSON.stringify(file), function (err) {
  if (err) return console.log(err)
  console.log(JSON.stringify(file))
  console.log('writing to ' + fileName)
});