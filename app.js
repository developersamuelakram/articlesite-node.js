const express = require("express");
const path = require("path"); // this is included in express so no need to install
const mongoose = require("mongoose");
const mongo = require("mongodb");
const bodyParser = require("body-parser");

let uri =
  "mongodb+srv://user1:12345@cluster0.wno08.mongodb.net/db1?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;

// if we are connected to mongoo

db.once("open", () => {
  console.log("connected to mongodb");
});

// check for DB errors

db.on("error", (err) => {
  console.log(err);
});

// Init app
const app = express();

// Load View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// bringing in models

let Article = require("./models/article");

// adding the middlewear of bodyPaser

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// start server
app.listen(3000, () => {
  console.log("Server Started on Port 3000....");
}); // giving the port number

// set static folder for assets
app.use(express.static(path.join(__dirname, "public")));

// home route
app.get("/", (req, res) => {
  Article.find({}, (error, articles) => {
    if (error) {
      console.log(error);
    } else {
      res.render("index", {
        // render is loading for view templates // Article is a schema, and small article is collection name
        title: "Articles",
        articles: articles,
      });
    }
  });
});

// click and open article

app.get("/article/:id", (req, res) => {
  Article.findById(req.params.id, (error, article) => {
    res.render("article", {
      article: article,
    });
  });
});

// add article route

app.get("/articles/add", (req, res) => {
  res.render("article_add", {
    title: "Add Article",
  });
});

// submitting route

app.post("/articles/add", (req, res) => {
  // creating instance of article
  let article = new Article();

  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  // save is method for saving something in database

  article.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/"); // after its saved returned to homepage
    }
  });
});

// returning json objects.

app.get("/api/jsonposts", (request, response) => {
  Article.find({}, (error, arrayOfPosts) => {
    if (!error) {
      response.json(arrayOfPosts);
    }
  });
});

// edit the article

app.get("/article/edit/:id", (req, res) => {
  Article.findById(req.params.id, (error, article) => {
    res.render("edit_article", {
      article: article,
    });
  });
});

// make changes

app.post("/article/edit/:id", (req, res) => {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = { _id: req.params.id };

  Article.update(query, article, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

// deleting article
app.get("/article/delete/:id", (req, res) => {
  let query = { _id: req.params.id };

  console.log(query);

  Article.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/display/list", (req, res) => {
  res.sendFile(__dirname + "/views/newfile.html");
});
