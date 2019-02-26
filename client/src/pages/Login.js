import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import axios from 'axios';





const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',

    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,

  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      showPassword: false,
      error: false,
      errorText: ''
    }
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value, error: false, errorText: '' });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  handleLogin = () => {

    var username = this.state.username;
    var password = this.state.password;

    if (username && password) {
      var body = { username: this.state.username, password: this.state.password }

      axios.post('/api/login', body)
        .then(res => {
          console.log(res.data)
          this.props.setDetails(res.data)
        })
        .catch(err => {
          console.log(err)
          if (err.response) {
            this.setState({
              errorText: err.response.data.error
            })
          } else {
            this.setState({
              errorText: 'Something went wrong'
            })
          }
        })
    } else {
      this.setState({
        error: true,
        errorText: 'Fields can\'t be empty'
      })
    }
  }



  render() {
    const { classes } = this.props;

    return (

      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
      </Typography>


          <div className={classes.form}>
            <FormControl margin="normal" required fullWidth error={this.state.error}>
              <InputLabel htmlFor="email">Username</InputLabel>
              <Input id="username" name="username"
                type={'text'}
                value={this.state.username}
                onChange={this.handleChange('username')} />
            </FormControl>
            <FormControl margin="normal" required fullWidth error={this.state.error}>
              <InputLabel htmlFor="adornment-password">Password</InputLabel>
              <Input
                id="adornment-password"
                type={this.state.showPassword ? 'text' : 'password'}
                value={this.state.password}
                onChange={this.handleChange('password')}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}
                    >
                      {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <Typography>
              {this.state.errorText}
            </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={this.handleLogin}
              className={classes.submit}
            >
              Sign in
          </Button>
          </div>
        </Paper>
      </main>
    );
  }


}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);