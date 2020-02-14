import {Route} from "react-router-dom";
import Login from "../../pages/Login/Login";
import React, {useContext} from "react";
import {GlobalContext} from "../../../context/GlobalState";

const PrivateRoute = ({component: Component, ...rest}) => {
    const {user} = useContext(GlobalContext);

    return (
        <Route {...rest} render={(props) => (user && user.state ? <Component {...props} /> : user.state === null ? <Login/> : null)}/>
    );
};

export default PrivateRoute;