import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  CircularProgress,
  Typography,
  Fade,
  Skeleton
} from '@mui/material';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { postAPI } from '../services/api';

const Feed = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const response = await postAPI.getAll();
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handleLike = async (postId) => {
    try {
      await postAPI.like(postId);
      // Update local state immediately for better UX
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                likes: post.likes.includes(localStorage.getItem('username'))
                  ? post.likes.filter(username => username !== localStorage.getItem('username'))
                  : [...post.likes, localStorage.getItem('username')]
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
      // Refresh posts on error to sync state
      fetchPosts();
    }
  };

  const handleComment = async (postId, commentData) => {
    try {
      await postAPI.comment(postId, commentData);
      fetchPosts(); // Refresh to get new comment
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const LoadingSkeleton = () => (
    <Box sx={{ mb: 2 }}>
      <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" height={24} width="40%" />
          <Skeleton variant="text" height={16} width="20%" />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navbar />
      
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Fade in timeout={800}>
          <Box>
            {/* Create Post Section */}
            <CreatePost onPostCreated={handlePostCreated} />

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
                    py: 8,
                    background: 'white',
                    borderRadius: 3,
                    boxShadow: '0 2px 15px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    No posts yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Be the first to share something with the community!
                  </Typography>
                </Box>
              ) : (
                // Posts List
                posts.map((post, index) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
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
