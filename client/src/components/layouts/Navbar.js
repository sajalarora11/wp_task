import React, { Fragment, useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../../context/auth/Context";

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const { isAuth, logout } = authContext;

  const logoutUser = e => {
    e.preventDefault();
    logout();
  };

  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="/">
          WP_APP
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {!isAuth || isAuth === null ? (
            <Fragment>
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to="/login">
                    <button className="nav-link btn btn-default">Login</button>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register">
                    <button className="nav-link btn btn-primary">
                      Register
                    </button>
                  </Link>
                </li>
              </ul>
            </Fragment>
          ) : (
            <Fragment>
              <ul className="navbar-nav nl-auto">
                <li className="nav-item">
                  <button className="btn btn-primary" onClick={logoutUser}>
                    Logout
                  </button>
                </li>
              </ul>
            </Fragment>
          )}
        </div>
      </nav>
    </Fragment>
  );
};

export default Navbar;
