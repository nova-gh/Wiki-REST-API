const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
let port = process.env.PORT || 3000;
const app = express();

app.set("view engine", "ejs");

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(express.static("public"));

//==Mongoose Connection

mongoose.connect(
	"mongodb+srv://admin:admin413@cluster0.hgnmf.mongodb.net/todolistDB",
	{ useNewUrlParser: true, useUnifiedTopology: true }
);

app.listen(port, () => {
	console.log(`Server is up! Local Port: ${port}!`);
});
