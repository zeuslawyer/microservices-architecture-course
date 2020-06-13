import React from "react";
import axios from "axios";

import useRequest from "../../hooks/useRequest";

const Signup = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [makeRequest, errorsJsx] = useRequest("/api/users/signup", "post", { email, password });

  const submitForm = async event => {
    event.preventDefault();
    makeRequest();
  };

  return (
    <>
      <form onSubmit={submitForm}>
        <div className="form-group">
          <label>Email Address</label>
          <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        {errorsJsx}
        <button className="btn btn-primary">Sign up</button>
      </form>
    </>
  );
};

export default Signup;
