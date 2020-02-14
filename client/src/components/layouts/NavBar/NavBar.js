import React, {useContext} from 'react';
import {Link, withRouter} from 'react-router-dom';
import SearchForm from "./SearchForm";
import {GlobalContext} from "../../../context/GlobalState";

const NavBar = (props) => {
    const {user} = useContext(GlobalContext);

    const logout = () => {
        user.logout();
        props.history.push('/');
    };
  const links = (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/">Home</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/login">Login</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/register">Register</Link>
      </li>
    </>
  );

  const authLinks = (
    <>
      <li>
          <SearchForm/>
      </li>
      <li className="nav-item">
        <Link className="nav-link"  to="/profile">Profile</Link>
      </li>
      <li className="nav-item">
        <span className="nav-link" style={{cursor: 'pointer'}} onClick={logout}>Logout</span>
      </li>
    </>
  );

  return (
    <nav className="navbar navbar-expand-md bg-dark navbar-dark ">
      <div className="container">
        <Link className="navbar-brand" to={user.state ? "/feed" : "/"}>Social Network</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsExample04">
          <ul className="navbar-nav ml-auto">
            { user.state ? authLinks : links }
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default withRouter(NavBar);
