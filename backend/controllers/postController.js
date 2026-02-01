const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    console.log('=== CREATE POST DEBUG ===');
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Request body:', req.body);
    console.log('File:', req.file);
    console.log('Text field:', req.body.text);
    console.log('========================');
    
    // Handle text field - ensure it's properly extracted
    let text = "";
    if (req.body && req.body.text) {
      text = req.body.text;
    } else if (req.body) {
      // Try to get text from any field
      const bodyKeys = Object.keys(req.body);
      for (const key of bodyKeys) {
        if (key.toLowerCase().includes('text') || key.toLowerCase().includes('content')) {
          text = req.body[key];
          break;
        }
      }
    }

    const newPost = new Post({
      userId: req.user.id,
      username: req.user.username,
      text: text || "",
      imageUrl: req.file ? req.file.filename : ""
    });

    console.log('Post to be saved:', {
      text: newPost.text,
      imageUrl: newPost.imageUrl,
      username: newPost.username
    });

    await newPost.save();

    res.status(201).json({ message: "Post Created Successfully", post: newPost });

  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likes.includes(req.user.username)) {
      post.likes = post.likes.filter(
        (username) => username !== req.user.username
      );
    } else {
      post.likes.push(req.user.username);
    }

    await post.save();

    res.status(200).json({ message: "Like updated", likes: post.likes.length });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.commentPost = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      username: req.user.username,
      text
    });

    await post.save();

    res.status(200).json({ message: "Comment added" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is the owner of the post
    if (post.username !== req.user.username) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await Post.findByIdAndDelete(req.params.postId);

    res.status(200).json({ message: "Post deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
