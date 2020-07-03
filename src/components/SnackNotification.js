import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const SnackNotification = ({ open, handleClose, message, severity }) => {
  return (
    <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackNotification;
