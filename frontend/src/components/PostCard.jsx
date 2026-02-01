import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Fade,
  Collapse,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Send,
  Delete,
  MoreVert
} from '@mui/icons-material';
import CommentSection from './CommentSection';

const PostCard = ({ post, onLike, onComment, onDelete, currentUser }) => {
  const [liked, setLiked] = useState(post.likes.includes(localStorage.getItem('username')));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const handleLike = async () => {
    setLoading(true);
    try {
      await onLike(post._id);
      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    
    try {
      await onComment(post._id, { text: commentText });
      setCommentText('');
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(post._id);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isOwner = currentUser === post.username;

  return (
    <Fade in timeout={600}>
      <Box
        sx={{
          p: 3,
          mb: 2,
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)',
          },
        }}
      >
        {/* Post Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: '#1976d2',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
              }}
            >
              {post.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: '#333',
                  fontSize: '1rem',
                  lineHeight: 1.2,
                }}
              >
                {post.username}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '0.8rem', mt: 0.5 }}
              >
                {formatTimeAgo(post.createdAt)}
              </Typography>
            </Box>
          </Box>
          
          {/* Menu Button for Owner */}
          {isOwner && (
            <>
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{
                  color: '#999',
                  '&:hover': {
                    color: '#666',
                    background: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <MoreVert />
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <MenuItem
                  onClick={() => {
                    setDeleteDialogOpen(true);
                    handleMenuClose();
                  }}
                  sx={{
                    color: '#f44336',
                    '&:hover': {
                      background: 'rgba(244, 67, 54, 0.1)',
                    },
                  }}
                >
                  <Delete sx={{ mr: 2, fontSize: 20 }} />
                  Delete Post
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* Post Content */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.6,
              color: '#333',
              mb: post.imageUrl ? 2 : 0,
              fontSize: '0.95rem',
            }}
          >
            {post.text}
          </Typography>
          
          {/* Post Image */}
          {post.imageUrl && (
            <Box
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                maxHeight: 400,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                bgcolor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={`https://socialapp-backend-xtuo.onrender.com/uploads/${post.imageUrl}`}
                alt="Post"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  maxHeight: '400px',
                }}
              />
            </Box>
          )}
        </Box>

        {/* Post Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Like Button */}
          <IconButton
            onClick={handleLike}
            disabled={loading}
            sx={{
              color: liked ? '#e91e63' : '#666',
              '&:hover': {
                background: liked ? 'rgba(233, 30, 99, 0.1)' : 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            {liked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ minWidth: '30px', fontSize: '0.85rem' }}
          >
            {likeCount}
          </Typography>

          {/* Comment Button */}
          <IconButton
            onClick={() => setShowComments(!showComments)}
            sx={{
              color: '#666',
              '&:hover': {
                background: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ChatBubbleOutline />
          </IconButton>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ minWidth: '30px', fontSize: '0.85rem' }}
          >
            {post.comments.length}
          </Typography>
        </Box>

        {/* Comment Section */}
        <Collapse in={showComments} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
            {/* Add Comment */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                }}
              />
              <IconButton
                onClick={handleComment}
                disabled={!commentText.trim()}
                sx={{
                  color: '#1976d2',
                  '&:hover': {
                    background: 'rgba(25, 118, 210, 0.1)',
                  },
                }}
              >
                <Send />
              </IconButton>
            </Box>

            {/* Comments List */}
            {post.comments.length > 0 && (
              <CommentSection comments={post.comments} />
            )}
          </Box>
        </Collapse>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              p: 2
            }
          }}
        >
          <DialogTitle sx={{ textAlign: 'center' }}>
            Delete Post
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
              Are you sure you want to delete this post? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default PostCard;
