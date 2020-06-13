import React from "react";

const Signup = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const submitForm = event => {
    event.preventDefault();

    console.log({
      email,
      password
    });
  };
  return (
    <form onSubmit={submitForm}>
      <div className="form-group">
        <label>Email Address</label>
        <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button className="btn btn-primary">Sign up</button>
    </form>
  );
};

export default Signup;
