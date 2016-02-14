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