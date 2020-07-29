import React from "react";
import Router from "next/router";

import useRequest from "../../hooks/useRequest";

const Signup = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const successRedirect = () => Router.push("/");
  const [makeRequest, errorsJsx] = useRequest("/api/users/signup", "post", { email, password }, successRedirect);

  const submitForm = async event => {
    event.preventDefault();
    await makeRequest();
  };

  return (
    <>
      <form onSubmit={submitForm}>
        <h1>Sign up</h1>

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
