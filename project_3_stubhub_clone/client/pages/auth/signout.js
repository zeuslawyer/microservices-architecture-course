import useRequest from "../../hooks/useRequest";
import Router from "next/router";
import React from "react";

const Signout = () => {
  const successRedirect = () => Router.push("/");

  const [makeRequest] = useRequest("/api/users/signout", "post", {}, successRedirect);

  React.useEffect(() => {
    makeRequest();
  }, []);

  return <div> Signing you out.</div>;
};

export default Signout;
