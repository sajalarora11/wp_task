import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

import Navbar from "./components/layouts/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import AuthState from "./context/auth/State";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";
import Home from "./components/layouts/Home";

const App = () => {
  return (
    <AuthState>
      <Router>
        <div>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </div>
      </Router>
    </AuthState>
  );
};

export default App;
