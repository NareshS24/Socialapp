import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Skeleton,
  Fade,
  Alert
} from '@mui/material';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = localStorage.getItem('username');

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://socialapp-backend-xtuo.onrender.com/api/posts/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        setError('Failed to fetch posts');
      }
    } catch (error) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://socialapp-backend-xtuo.onrender.com/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchPosts(); // Refresh posts to get updated like count
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId, commentData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://socialapp-backend-xtuo.onrender.com/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
      });
      
      if (response.ok) {
        fetchPosts(); // Refresh posts to get updated comments
      }
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://socialapp-backend-xtuo.onrender.com/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Remove the deleted post from the state
        setPosts(posts.filter(post => post._id !== postId));
      } else {
        setError('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Error deleting post');
    }
  };

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <Box
      sx={{
        p: 3,
        mb: 2,
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" height={24} width="40%" />
          <Skeleton variant="text" height={16} width="20%" />
        </Box>
      </Box>
      <Skeleton variant="text" height={20} />
      <Skeleton variant="text" height={20} width="80%" />
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" height={16} width="40px" />
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" height={16} width="40px" />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navbar />
      
      <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
        <Fade in timeout={800}>
          <Box>
            {/* Create Post Section */}
            <CreatePost onPostCreated={handlePostCreated} />

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Posts Feed */}
            <Box>
              {loading ? (
                // Loading Skeletons
                <>
                  <LoadingSkeleton />
                  <LoadingSkeleton />
                  <LoadingSkeleton />
                </>
              ) : posts.length === 0 ? (
                // No Posts State
                <Box
                  sx={{
                    textAlign: 'center',
                    py: { xs: 6, sm: 8 },
                    background: 'white',
                    borderRadius: 3,
                    boxShadow: '0 2px 15px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 2, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                  >
                    No posts yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    Be the first to share something with the community!
                  </Typography>
                </Box>
              ) : (
                // Posts List
                posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onDelete={handleDelete}
                    currentUser={currentUser}
                  />
                ))
              )}
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Feed;
