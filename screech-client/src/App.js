import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import './App.css';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import jwtDecode from 'jwt-decode';
// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';
// Components
import Navbar from './components/layout/Navbar';
import AuthRoute from './util/AuthRoute';
// Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
import user from './pages/user';

import axios from 'axios';

axios.defaults.baseURL =
  'https://us-central1-screech-259f4.cloudfunctions.net/api';

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = '/login';
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}
export default function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: {
            light: '#AA7756',
            main: '#807059',
            dark: '#674E38',
            contrastText: '#fff'
          },
          secondary: {
            light: '#ff6333',
            main: '#ff3d00',
            dark: '#b22a00',
            contrastText: '#fff'
          }
        },
        typography: {
          useNextVariants: true
        },
        spreadIt: {
          form: {
            textAlign: 'center'
          },
          image: {
            margin: '20px auto'
          },
          pageTitle: {
            margin: '10px auto'
          },
          textField: {
            margin: '10px auto'
          },
          button: {
            marginTop: 20,
            position: 'relative'
          },
          customError: {
            color: 'red',
            fontSize: '0.8rem',
            marginTop: 10
          },
          progress: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12
          },
          invisibleSeparator: {
            border: 'none',
            margin: 4
          },
          visibleSeparator: {
            width: '100%',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            marginBottom: 20
          },
          paper: {
            padding: 20
          },
          profile: {
            '& .image-wrapper': {
              textAlign: 'center',
              position: 'relative',
              '& button': {
                position: 'absolute',
                top: '80%',
                left: '70%'
              }
            },
            '& .profile-image': {
              width: 200,
              height: 200,
              objectFit: 'cover',
              maxWidth: '100%',
              borderRadius: '50%'
            },
            '& .profile-details': {
              textAlign: 'center',
              '& span, svg': {
                verticalAlign: 'middle'
              },
              '& a': {
                color: '#00bcd4'
              }
            },
            '& hr': {
              border: 'none',
              margin: '0 0 10px 0'
            },
            '& svg.button': {
              '&:hover': {
                cursor: 'pointer'
              }
            }
          },
          buttons: {
            textAlign: 'center',
            '& a': {
              margin: '20px 10px'
            }
          }
        }
      }),
    [prefersDarkMode]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <Navbar />
          <div className='container'>
            <Switch>
              <Route exact path='/' component={home} />
              <AuthRoute exact path='/login' component={login} />
              <AuthRoute exact path='/signup' component={signup} />
              <Route exact path='/:handle' component={user} />
              <Route
                exact
                path='/:handle/screech/:screechId'
                component={user}
              />
            </Switch>
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}
