import React, {useState, forwardRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const ALERT_DURATION = 5000;

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const InstantMessage = (props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, [props.message]);
    
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    props.onClose();
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={ALERT_DURATION} 
      onClose={handleClose}>
      <Alert onClose={handleClose} severity="error">{props.message}</Alert>
    </Snackbar>
  );
};

InstantMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default InstantMessage;