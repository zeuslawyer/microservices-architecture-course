import React from "react";
import useRequest from "../../hooks/useRequest";
import Router from "next/router";

const NewTicket = () => {
  const [title, setTitle] = React.useState("");
  const [price, setPrice] = React.useState("");

  const successRedirect = ticket => {
    Router.push("/");
  };

  const [makeRequest, errorsJsx] = useRequest(
    "/api/tickets",
    "post",
    { title, price },
    successRedirect
  );

  const onSubmit = event => {
    event.preventDefault();
    makeRequest();
  };
  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value) || typeof value !== "number") {
      return;
    }
    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            className="form-control"
            value={price}
            onChange={e => setPrice(e.target.value)}
            onBlur={onBlur}
          />
        </div>
        {errorsJsx}
        <button className="btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
