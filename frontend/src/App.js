import React, {useState, useCallback} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

import NewPlace from './places/pages/NewPlace';
import Users from './user/pages/Users';
import UserPlaces from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UpdatePlace from './places/pages/UpdatePlace';
import AuthUser from './user/pages/Auth';
import {AuthContext} from './shared/components/context/auth-context'

const App = () =>{
  const userList = [
    {id:1, name:'user1'},
    {id:2, name:'user2'},
  ];

  const [isLoggedIn, switchIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState()

  //usecallback will re-create the function, when any of its dependency changes
  const login = useCallback( (uid) => {
    switchIsLoggedIn(true)
    setUserId(uid)
  }, [])

  const logout = useCallback( () => {
    switchIsLoggedIn(false)
    setUserId(null)
  }, [])

  let routes ;
  
  if(isLoggedIn){
    routes = (
      <Switch>
      <Route path="/" exact>
        <Users />
      </Route>
      <Route path="/:userId/places" exact>
        <UserPlaces />
      </Route>
      <Route path="/places/new" exact>
        <NewPlace />
      </Route>
      <Route path="/places/:placeId">
        <UpdatePlace />
      </Route>
      <Redirect to="/" />
    </Switch>
    );
  } else {
    routes = (
      <Switch>
      <Route path="/" exact>
        <Users />
      </Route>
      <Route path="/:userId/places" exact>
        <UserPlaces />
      </Route>
      <Route path="/auth">
        <AuthUser />
      </Route>
      <Redirect to="/auth" />
    </Switch>
    );
  }

  return (
    // AuthContext - value - will set isLoggedIn, login, logout , and will re-render each component which depends on this context
    <AuthContext.Provider value={{ isLoggedIn: isLoggedIn, userId: userId, login: login, logout: logout}}>
      <Router>
        <MainNavigation />
        <main>
          {routes}
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
