const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  username: {
    type: String,
    required: true
  },
  text: {
    type: String
  },
  imageUrl: {
    type: String
  },
  likes: {
    type: [String],
    default: []
  },
  comments: [
    {
      username: String,
      text: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", postSchema);
