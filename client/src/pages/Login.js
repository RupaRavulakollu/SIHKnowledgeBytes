import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import classNames from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import LinearProgress from '@material-ui/core/LinearProgress';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import AccountCircle from '@material-ui/icons/AccountCircle';

import BG from '../images/Background01.jpg';


const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    padding: '0',
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',

    },
  },

  body: {
    backgroundImage: 'url(' + BG + ')',
    backgroundSize: 'cover',
    opacity: 1,
    overflow: 'hidden',
    height: '100vh',

  },
  paper: {
    marginTop: theme.spacing.unit * 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    opacity: 15,
    backgroundColor: '#ffffffcc'
  },
  forgot: {
    marginLeft: theme.spacing.unit * 5,
    alignItems: 'corner',
  },
  avatar: {
    margin: theme.spacing.unit,
    width: '100',
    height: '100',
    backgroundColor: theme.palette.secondary.main,
    padding: '',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    margin: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  loader: {
    borderRadius: 5,

  },

});

class Login extends Component {

  state = {
    checked: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      showPassword: false,
      userNameError: false,
      userNameErrorText: '',
      passwordError: false,
      passwordErrorText: '',
      showLoader: false,
    }
  };

  handleChange = prop => event => {
    this.setState(state => ({ checked: !state.checked }));
    this.setState({
      [prop]: event.target.value, userNameError: false,
      userNameErrorText: '',
      passwordError: false,
      passwordErrorText: '',
    });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  handleLogin = () => {

    var { email, password } = this.state;

    if (!email) {
      this.setState({
        userNameError: true,
        userNameErrorText: 'Fill in the email',
      })
    } else if (!password) {
      this.setState({
        passwordError: true,
        passwordErrorText: 'Fill in the password',
      })
    } else {
      var body = { email: email, password: password }
      this.setState({
        showLoader: true
      })
      axios.post('/api/login', body)
        .then(res => {
          console.log(res.data)
          window.userDetails = res.data
          this.props.setDetails()
        })
        .catch(err => {
          console.log(err)
          if (err.response) {
            if (err.response.status === 403)
              this.setState({
                userNameError: true,
                userNameErrorText: 'Wrong Credentials',
                passwordError: true,
                passwordErrorText: 'Wrong Credentials',
              })
            else
              this.setState({
                errorText: 'Something went wrong'
              })
          } else {
            this.setState({
              errorText: 'Something went wrong'
            })
          }
        })
        .finally(() => {
          this.setState({
            showLoader: false
          })
        })
    }
  }



  render() {

    const { classes } = this.props;
    return (
      <div className={classes.body}>
        <main className={classes.main}>

          <Paper elevation={2} className={classes.paper}>
            <Avatar className={classes.avatar}>
              <AccountCircle style={{ viewBox: '0 0 100 200', }} />
            </Avatar>
            <Typography variant="h3" style={{ fontWeight: "" }}>LOG IN</Typography>
            <div className={classes.form}>

              <TextField
                id="outlined-userName"
                label="Username"
                className={classes.textField}
                value={this.state.userName}
                onChange={this.handleChange('email')}
                margin="normal"
                error={this.state.userNameError}
                helperText={this.state.userNameErrorText}
                fullWidth
              />

              <TextField
                id="outlined-adornment-password"
                className={classNames(classes.margin, classes.textField)}
                error={this.state.passwordError}
                helperText={this.state.passwordErrorText}
                type={this.state.showPassword ? 'text' : 'password'}
                label="Password"
                fullWidth
                value={this.state.password}
                onChange={this.handleChange('password')}
                onKeyPress={event => {
                  if (event.key === 'Enter')
                    this.handleLogin()
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword}
                      >
                        {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Typography style={{ fontSize: 15, marginTop: '8px', textAlign: 'right' }}>
                {'Forgot Password?'}
              </Typography>

              <Button
                fullWidth
                disabled={this.state.showLoader}
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={this.handleLogin}

              >
                {'Submit'}
              </Button>
              {this.state.showLoader && <LinearProgress color='primary' classes={{ root: classes.loader }} />}
            </div>
          </Paper>

        </main>
      </div>

      // <main className={classes.main}>
      //   <CssBaseline />
      //   <Paper className={classes.paper}>
      //     <Avatar className={classes.avatar}>
      //       <LockOutlinedIcon />
      //     </Avatar>
      //     <Typography component="h1" variant="h5">
      //       {"Sign in"}
      //     </Typography>


      //     <div className={classes.form}>
      //       <FormControl margin="normal" required fullWidth error={this.state.error}>
      //         <InputLabel htmlFor="email">{"Email"}</InputLabel>
      //         <Input id="email" name="email"
      //           type={'text'}
      //           value={this.state.email}
      //           onChange={this.handleChange('email')} />
      //       </FormControl>
      //       <FormControl margin="normal" required fullWidth error={this.state.error}>
      //         <InputLabel htmlFor="adornment-password">{"Password"}</InputLabel>
      //         <Input
      //           id="adornment-password"
      //           type={this.state.showPassword ? 'text' : 'password'}
      //           value={this.state.password}
      //           onChange={this.handleChange('password')}
      //           endAdornment={
      //             <InputAdornment position="end">
      //               <IconButton
      //                 aria-label="Toggle password visibility"
      //                 onClick={this.handleClickShowPassword}
      //               >
      //                 {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
      //               </IconButton>
      //             </InputAdornment>
      //           }
      //         />
      //       </FormControl>

      //       <Typography variant="overline">
      //         {this.state.errorText}
      //       </Typography>

      //       <Button
      //         type="submit"
      //         fullWidth
      //         disabled={this.state.showLoader}
      //         variant="contained"
      //         color="primary"
      //         onClick={this.handleLogin}
      //         className={classes.submit}
      //       >
      //         {"Sign in"}
      //       </Button>
      //     {this.state.showLoader && <LinearProgress color='primary' classes={{root: classes.loader}}/>}
      //     </div>
      //   </Paper>
      // </main>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);