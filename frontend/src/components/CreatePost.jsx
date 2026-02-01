import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Avatar,
  IconButton,
  CircularProgress,
  Typography,
  Fade,
  Paper
} from '@mui/material';
import {
  Image as ImageIcon,
  Send,
  Close,
  PhotoCamera
} from '@mui/icons-material';

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem('username');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const handleSubmit = async () => {
    if (!text.trim() && !image) return;

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('text', text);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch('https://socialapp-backend-xtuo.onrender.com/api/posts/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        setText('');
        setImage(null);
        setImagePreview('');
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={800}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 52,
              height: 52,
              bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              mr: 2
            }}
          >
            {username?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#1a1a1a',
                fontSize: '1.1rem'
              }}
            >
              {username || 'User'}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.85rem' }}
            >
              Share your thoughts with the community
            </Typography>
          </Box>
        </Box>

        {/* Text Input */}
        <TextField
          fullWidth
          multiline
          minRows={3}
          maxRows={6}
          placeholder="What's on your mind? Share something amazing..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              transition: 'all 0.2s ease',
              '& fieldset': {
                border: 'none',
              },
              '&:hover': {
                backgroundColor: '#ffffff',
                borderColor: '#667eea',
              },
              '&.Mui-focused': {
                backgroundColor: '#ffffff',
                borderColor: '#667eea',
                boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
              },
            },
            '& .MuiInputBase-input': {
              fontSize: '0.95rem',
              lineHeight: 1.6,
              color: '#2c3e50',
              '&::placeholder': {
                color: '#95a5a6',
                fontStyle: 'italic',
              },
            },
          }}
        />

        {/* Image Preview */}
        {imagePreview && (
          <Box sx={{ mb: 2, position: 'relative' }}>
            <Box
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 200,
              }}
            >
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: '100%',
                  maxHeight: 300,
                  objectFit: 'contain',
                }}
              />
            </Box>
            <IconButton
              onClick={removeImage}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 1)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <Close sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        )}

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left Actions */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <input
              accept="image/*"
              id="image-upload"
              type="file"
              hidden
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload">
              <Button
                component="span"
                startIcon={<PhotoCamera />}
                sx={{
                  textTransform: 'none',
                  color: '#667eea',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 500,
                  backgroundColor: 'rgba(102, 126, 234, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.15)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Add Photo
              </Button>
            </label>
          </Box>

          {/* Post Button */}
          <Button
            variant="contained"
            disabled={(!text.trim() && !image) || loading}
            onClick={handleSubmit}
            endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Send />}
            sx={{
              textTransform: 'none',
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '0.95rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                background: '#e9ecef',
                color: '#adb5bd',
                boxShadow: 'none',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </Box>
      </Paper>
    </Fade>
  );
};

export default CreatePost;
