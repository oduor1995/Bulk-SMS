import React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';

interface SimpleSnackbarProps {
  open: boolean;
  setOpen: (open: boolean) => void; // Function to set the open state
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export const SimpleSnackbar: React.FC<SimpleSnackbarProps> = ({
  open,
  setOpen,
  message,
  severity,
}) => {
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={() => setOpen(false)}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => setOpen(false)} // Simplified to directly call setOpen
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={action}
        anchorOrigin={{
          vertical: 'top', // Vertical position
          horizontal: 'center', // Horizontal position
        }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};
