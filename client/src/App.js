import React, {useEffect, useContext} from 'react';
import jwtDecode from 'jwt-decode';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import {GlobalContext} from "./context/GlobalState";
import NavBar from "./components/layouts/NavBar/NavBar";
import PrivateRoute from "./components/util/PrivateRoute";
import Login from "./components/pages/Login/Login";
import Home from "./components/pages/Home";
import Register from "./components/pages/Register/Register";
import Feed from "./components/pages/PostFeed/PostFeed";
import Profile from "./components/pages/Profile/Profile";
import EditProfile from "./components/pages/Profile/EditProfile";
import CreatePost from "./components/pages/CreatePost/CreatePost";
import ViewPost from "./components/pages/ViewPost/ViewPost";
import SearchFeed from "./components/pages/SearchFeed/SearchFeed";
import axios from "axios";
import {API_URL} from "./constants";
import mangeJWT from "./util/mangeJWT";


function App() {

    const {user} = useContext(GlobalContext);

    useEffect(() => {
        //check for jwt token
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            const decoded = jwtDecode(jwt);
            if (decoded.exp > Date.now() / 1000) {
                //grab userdata
                mangeJWT.set(jwt);
                //grab userdata
                axios.get(`${API_URL}/users`)
                    .then(res => {
                        user.setState(res.data.user);
                    });
            } else {
                localStorage.removeItem('jwt');
            }

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="App">
            <Router>
                <NavBar/>
                <Switch>
                  <Route exact path='/' component={Home} />
                  <Route path='/login' component={Login} />
                  <Route path='/register' component={Register} />
                  <PrivateRoute exact path='/feed' component={Feed} />
                  <PrivateRoute exact path='/profile' component={Profile} />
                  <PrivateRoute exact path='/profile/:id' component={Profile} />
                  <PrivateRoute exact path='/edit-profile' component={EditProfile} />
                  <PrivateRoute exact path='/create-post' component={CreatePost} />
                  <PrivateRoute path='/post/:id' component={ViewPost} />
                  <PrivateRoute path='/s/:id' component={SearchFeed} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
