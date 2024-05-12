'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Button,
  MenuIconButton,
  MenuIcon,
} from '@mui/material';
import theme from '../theme';

export default function Sub() {
  return (
    <>
      <div>sub page</div>
      <AppBar position="static">
        <Toolbar className="tw-justify-center">
          <a href="/" className="tw-font-bold">
            AppBar
          </a>
        </Toolbar>
      </AppBar>
      <ThemeProvider theme={theme}>
        <Button className="tw-m-10" size="small" href="../" color="secondary" variant="outlined">
          to main page!
        </Button>
      </ThemeProvider>
    </>
  );
}
