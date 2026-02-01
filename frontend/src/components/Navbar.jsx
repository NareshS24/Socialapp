import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import {
  RocketLaunch
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
    setLogoutDialogOpen(false);
  };

  const handleProfileClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutDialogClose = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          color: '#333',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo and App Name */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/feed')}
          >
            <Avatar
              sx={{
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 2px 10px rgba(102, 126, 234, 0.3)',
                mr: { xs: 1, sm: 2 }
              }}
            >
              <RocketLaunch sx={{ fontSize: { xs: 16, sm: 20 } }} />
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              SocialBox
            </Typography>
          </Box>

          {/* Right side - User Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: '#666',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              @{username}
            </Typography>
            
            <IconButton
              onClick={handleProfileClick}
              sx={{ p: 0 }}
              title="Click to logout"
            >
              <Avatar
                sx={{
                  width: { xs: 28, sm: 36 },
                  height: { xs: 28, sm: 36 },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 2px 10px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.5)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {username?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutDialogClose}
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
          Logout
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
            Are you sure you want to logout?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
          <Button
            onClick={handleLogoutDialogClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
