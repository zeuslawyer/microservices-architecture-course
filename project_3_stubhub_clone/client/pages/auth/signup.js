import React from "react";
import axios from "axios";
const Signup = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const submitForm = async event => {
    event.preventDefault();
    const PATH = "/api/users/signup";
    let res;
    try {
      res = await axios.post(PATH, {
        email,
        password
      });
      console.log("RESPONSE", res);
    } catch (error) {
      if (error.response) {
        const err = error.response.data.errors[0];
        setError(err.message);
      }
    } finally {
      setPassword("");
      setEmail("");
    }
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
        <button className="btn btn-primary">Sign up</button>
      </form>
      {error ? <p style={{ color: "red" }}> {error}</p> : null}
    </>
  );
};

export default Signup;
