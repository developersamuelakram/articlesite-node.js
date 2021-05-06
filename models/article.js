let mongoose = require("mongoose");

// Article Schema

let articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

//  top export this model everywhere we can do this
let Article = (module.exports = mongoose.model("Article", articleSchema));
