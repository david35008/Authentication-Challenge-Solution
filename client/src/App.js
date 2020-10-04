import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Logged } from './components/login/useContextComp';
import Login from './components/login/login';
import Registaer from './components/registaer/registaer';
import { create } from './components/Network/Ajax';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';

function App() {

  const [isLogged, setIsLogged] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (Cookies.get('accessToken')) {
      create('/users/tokenValidate')
        .then(res => {
          setIsLogged(res.valid);
          setLoading(false);
        })
        .catch(err => { setLoading(false); setIsLogged(false); console.error(err); })
    } else {
      setIsLogged(false)
      setLoading(false)
    }

  }, [])

  return (
    <Router>
      {!loading ?
        !isLogged ?
          <Logged.Provider value={{ isLogged, setIsLogged }}>
            <Switch>
              <Route path="/register">
                <Registaer />
              </Route>
              <Route path="/">
                <Login />
              </Route>
            </Switch>
          </Logged.Provider>
          :
          <Logged.Provider value={{ isLogged, setIsLogged }}>
            <Switch>
              <Route path="/">
                <Home />
              </Route>
            </Switch>

          </Logged.Provider>
        :
        <div></div>
      }
    </Router>
  );
}

export default App;
