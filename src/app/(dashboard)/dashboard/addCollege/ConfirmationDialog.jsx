import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Slide from '@mui/material/Slide'

// Slide transition for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

// Custom styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '8px',
    padding: 0,
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.15)',
    background: theme.palette.background.paper,
    minWidth: '320px',
    maxWidth: '400px'
  }
}))

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontSize: '1.125rem',
  fontWeight: '600',
  textAlign: 'center',
  color: theme.palette.text.primary,
  padding: theme.spacing(2, 2, 1, 2),
  margin: 0
}))

const StyledDialogContentText = styled(DialogContentText)(({ theme }) => ({
  fontSize: '0.875rem',
  textAlign: 'center',
  color: theme.palette.text.secondary,
  padding: theme.spacing(0, 2, 1, 2),
  margin: 0
}))

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  justifyContent: 'center',
  padding: theme.spacing(1.5, 2, 2, 2),
  gap: theme.spacing(1),
  '& .MuiButton-root': {
    margin: 0,
    padding: theme.spacing(0.75, 2.5),
    borderRadius: '6px',
    textTransform: 'none',
    fontSize: '0.875rem',
    minWidth: '80px'
  }
}))

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      aria-labelledby='confirmation-dialog-title'
      aria-describedby='confirmation-dialog-description'
    >
      <StyledDialogTitle id='confirmation-dialog-title'>
        {title}
      </StyledDialogTitle>
      <DialogContent sx={{ padding: '0 16px 8px 16px' }}>
        <StyledDialogContentText id='confirmation-dialog-description'>
          {message}
        </StyledDialogContentText>
      </DialogContent>
      <StyledDialogActions>
        <Button
          onClick={onClose}
          variant='outlined'
          color='primary'
          sx={{
            border: '1.5px solid',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
              border: '1.5px solid'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant='contained'
          sx={{
            backgroundColor: '#ef4444',
            '&:hover': {
              backgroundColor: '#dc2626'
            }
          }}
        >
          Logout
        </Button>
      </StyledDialogActions>
    </StyledDialog>
  )
}

export default ConfirmationDialog
