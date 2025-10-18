'use client';
import React, { useContext } from 'react';
import { IconButton, useTheme, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { ColorModeContext } from '@/app/providers'; 

export default function ThemeToggle() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Tooltip title={`Switch to ${theme.palette.mode === 'dark' ? 'Light' : 'Dark'} Mode`}>
        <IconButton 
            onClick={colorMode.toggleColorMode} 
            color="inherit" 
            sx={{ flexShrink: 0 }}
        >
        {/* Theme toggle (Light/Dark mode using MUI theming) */}
        {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
    </Tooltip>
  );
}