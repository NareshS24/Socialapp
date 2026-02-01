const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { createPost, getAllPosts, likePost, commentPost, deletePost } = require("../controllers/postController");

router.post("/create", authMiddleware, upload.single("image"), createPost);
router.get("/all", getAllPosts);
router.put("/like/:postId", authMiddleware, likePost);
router.post("/comment/:postId", authMiddleware, commentPost);
router.delete("/:postId", authMiddleware, deletePost);

module.exports = router;
