const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    console.log('=== CREATE POST DEBUG ===');
    console.log('Request body:', req.body);
    console.log('File:', req.file);
    
    const { text } = req.body;
    const imageUrl = req.file ? req.file.filename : null;
    
    console.log('Text:', text);
    console.log('Image URL:', imageUrl);
    console.log('========================');

    const newPost = new Post({
      userId: req.user.id,
      username: req.user.username,
      text: text || "",
      imageUrl: imageUrl
    });

    const savedPost = await newPost.save();
    console.log('Saved post:', savedPost);

    res.status(201).json({ message: "Post Created Successfully", post: savedPost });

  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    console.log('All posts with imageUrl:');
    posts.forEach(post => {
      console.log(`Post ID: ${post._id}, imageUrl: "${post.imageUrl}", text: "${post.text.substring(0, 50)}..."`);
    });
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
