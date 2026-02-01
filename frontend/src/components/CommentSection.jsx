import React from 'react';
import {
  Box,
  Avatar,
  Typography,
  Fade
} from '@mui/material';

const CommentSection = ({ comments }) => {
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <Box>
      {comments.map((comment, index) => (
        <Fade in timeout={400 + (index * 100)} key={index}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)',
                flexShrink: 0
              }}
            >
              {comment.username?.charAt(0).toUpperCase()}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: '#333',
                  }}
                >
                  {comment.username}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {formatTimeAgo(comment.createdAt || new Date())}
                </Typography>
              </Box>
              
              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.5,
                  color: '#555',
                  background: 'rgba(0, 0, 0, 0.02)',
                  p: 1.5,
                  borderRadius: 2,
                }}
              >
                {comment.text}
              </Typography>
            </Box>
          </Box>
        </Fade>
      ))}
    </Box>
  );
};

export default CommentSection;
