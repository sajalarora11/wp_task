import React, { useEffect, useContext } from "react";

import AuthContext from "../context/auth/Context";

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const { user, loadUser } = authContext;

  useEffect(() => {
    loadUser();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center">
            Congrats! {user === null ? "" : user.username} You made it to the
            Dashboard :)
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
