import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container-fluid text-center">
      <br />
      <br />
      <h3>Welcome</h3>
      <p>
        Please <Link to="/login">Login</Link> or{" "}
        <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Home;
