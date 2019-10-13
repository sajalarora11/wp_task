import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import AuthContext from "../context/auth/Context";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);

  const { isAuth } = authContext;
  return (
    <Route
      {...rest}
      render={props =>
        !localStorage.getItem("token") || isAuth === null ? (
          <Redirect to="/login" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
