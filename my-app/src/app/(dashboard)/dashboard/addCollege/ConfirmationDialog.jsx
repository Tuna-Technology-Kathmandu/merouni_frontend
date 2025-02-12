import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Slide from "@mui/material/Slide";

// Slide transition for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Custom styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    padding: theme.spacing(2),
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    background: theme.palette.background.paper,
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: "600",
  textAlign: "center",
  color: theme.palette.text.primary,
  padding: theme.spacing(3),
}));

const StyledDialogContentText = styled(DialogContentText)(({ theme }) => ({
  fontSize: "1rem",
  textAlign: "center",
  color: theme.palette.text.secondary,
  padding: theme.spacing(2),
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  justifyContent: "center",
  padding: theme.spacing(3),
  "& .MuiButton-root": {
    margin: theme.spacing(0, 2),
    padding: theme.spacing(1, 4),
    borderRadius: "8px",
    textTransform: "none",
    fontSize: "1rem",
  },
}));

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <StyledDialogTitle id="confirmation-dialog-title">
        {title}
      </StyledDialogTitle>
      <DialogContent>
        <StyledDialogContentText id="confirmation-dialog-description">
          {message}
        </StyledDialogContentText>
      </DialogContent>
      <StyledDialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          color="primary"
          sx={{
            border: "2px solid",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.04)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="secondary"
          sx={{
            backgroundColor: "#ff4444",
            "&:hover": {
              backgroundColor: "#cc0000",
            },
          }}
        >
          Confirm
        </Button>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default ConfirmationDialog;