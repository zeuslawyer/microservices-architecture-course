import React from "react";
import axios from "axios";
const Signup = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState([]);

  const submitForm = async event => {
    event.preventDefault();
    const PATH = "/api/users/signup";
    let res;
    try {
      res = await axios.post(PATH, {
        email,
        password
      });
      // clear fields
      setEmail("");
      setPassword("");
      setErrors([]);
    } catch (error) {
      if (error.response) {
        const errs = error.response.data.errors;
        setErrors(errs);
      }
    }
  };

  const renderErrors = () => {
    if (errors.length === 0) return null;

    return (
      <div className="alert alert-danger">
        <h3>Ooops...</h3>
        <ul>
          {errors.map((e, idx) => (
            <li key={idx + e.message}>{e.message}</li>
          ))}
        </ul>
      </div>
    );
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
        {renderErrors()}
        <button className="btn btn-primary">Sign up</button>
      </form>
    </>
  );
};

export default Signup;
