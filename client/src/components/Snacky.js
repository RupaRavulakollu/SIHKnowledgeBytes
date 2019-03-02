import React from "react"
import classNames from 'classnames';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import green from '@material-ui/core/colors/green';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  success: {
    backgroundColor: green[500],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: 10,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  close: {
    padding: theme.spacing.unit / 2,
  },
});

class Snacky extends React.Component {
  render() {
    const { classes, message, error, open, onClose } = this.props;
    const DisplayIcon = error ? ErrorIcon : CheckCircleIcon
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={open}
        autoHideDuration={3000}
        onClose={onClose}
      >
        <SnackbarContent
          className={error ? classes.error : classes.success}
          message={
            <span id="snackbar" className={classes.message}>
              <DisplayIcon className={classNames(classes.icon, classes.iconVariant)} />
              {message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </Snackbar>
    );
  }
}

export default withStyles(styles)(Snacky);