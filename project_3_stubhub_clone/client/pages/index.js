import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log("props", currentUser);
  return <h1>Landing page!</h1>;
};

// custom NextJs API to do some work while NextJs is building up the HTML to render back
// often done to fetch data for the initial / first load of page

// this function is run by the SERVER on initial load, reload etc,  and in the BROWSER/CLIENT when navigating between pages of the client app .
LandingPage.getInitialProps = async ({ req }) => {
  // determine if we're on server or browser
  const isServerSide = typeof window === "undefined";

  const namespace = `ingress-nginx`; // obtain with kubectl get namespace
  const srvName = `ingress-nginx-controller`; // obtain with kubectl get services -n <ingress-nginx namespace>
  const suffix = `svc.cluster.local`;

  // handle url routing logic depending on environment
  const options = {};
  let baseUrl;
  const path = "/api/users/currentuser";
  if (isServerSide) {
    baseUrl = `http://${srvName}.${namespace}.${suffix}` + path;
    // set options with a Host header so that the ingress-nginx-srv service knows which domain this request is coming from, since its not coming from browser
    options.headers = req.headers; // pass along the headers, which includes cookie and domain (so that ingress-nginx-srv can inspect the incoming request domain)
  } else {
    baseUrl = path;
  }
  console.log("THE URL", baseUrl);

  const response = await axios.get(baseUrl, options);
  return response.data; // the current user object to be passed into component as props
};
export default LandingPage;
