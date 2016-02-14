var express = require("express");
var app = express();
var bodyParser = require('body-parser');
const low = require('lowdb')
const storage = require('lowdb/file-sync')
const db = low('db.json', { storage: storage })
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("www"));

var token = function(length) {
	var length = length || 25;
	var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	var token = "";
	for(var i=0; i<length; i++) {
		var R = Math.floor(Math.random()*chars.length);
		token += chars.substring(R, R+1);
	}
	return token;
};

app.get("/", function(req, res) {
	res.send("Hello");
});
app.post("/upload", function(req, res) {
	console.log(req.body);
	var found = false, id = token(6);
	while (!found) {
		if (typeof db("organizers").find({ id: id }) == "undefined") {
			found = true;
		} else {
			id = token(6);
		}
	}
	req.body["JoinCode"] = id;
	db("organizers").push(req.body);
	res.cookie("JoinCode", id);
	res.send({ success: 1 });
});

app.set("host", "0.0.0.0");
app.listen(1337, function() {
	console.log("Listening.");
});