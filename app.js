const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
let port = process.env.PORT || 3000;
const app = express();
require("dotenv").config();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//==Mongoose Connection

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//article schema
const articleSchema = {
  title: String,
  content: String,
};
//article model
const Article = mongoose.model("Article", articleSchema);
// (/articles chained route)
app
  .route("/")
  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
        // console.log(foundArticles);
        // res.send("Successfully found articles");
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save((err) => {
      if (!err) {
        res.send("Articles saved to DB");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("All articles deleted from DB");
      } else {
        res.send(err);
      }
    });
  });
//Specific route target: /articles/name
app
  .route("/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
        // console.log(foundArticles);
        // res.send("Successfully found articles");
      } else {
        res.send("No articles matching that title was found");
      }
    });
  })
  .put((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err) => {
        if (!err) {
          //when using put method: it updates the whole thing.
          //Ex: If u put request on just the content it will wipe out everything and just put content
          //put request: content: "The first rule...."
          //title: Jack Bauer, content:"Jack Bauer once stepped into quicksand.."
          // new update: title:, content:"The first rule.."
          res.send("Success: Updated Article ");
        } else {
          res.send("Failed: Update Article ");
        }
      }
    );
  })
  .patch((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body }, //lets user update specific data
      (err) => {
        if (!err) {
          res.send("Success: Updated Article");
        } else {
          res.send("Failed: Update Article");
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (!err) {
        res.send("Success: Deleted Article");
      } else {
        res.send("Fail: Deleting Article");
      }
    });
  });

app.listen(port, () => {
  console.log(`Server is up! Local Port: ${port}!`);
});
