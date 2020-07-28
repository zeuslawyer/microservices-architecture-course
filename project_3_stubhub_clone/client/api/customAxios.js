import axios from "axios";

const customAxios = ({ req }) => {
  const isServerSide = typeof window === "undefined";
  const namespace = `ingress-nginx`; // obtain with kubectl get namespace
  const srvName = `ingress-nginx-controller`; // obtain with kubectl get services -n <ingress-nginx namespace>
  const suffix = `svc.cluster.local`;

  if (isServerSide) {
    // return axios object
    return axios.create({
      baseURL: `http://${srvName}.${namespace}.${suffix}`,
      headers: req.headers,
    });
  } else {
    // browser side
    return axios.create({
      baseURL: "/", // empty base url - but optional. can be left off
      // no need for headers as this is coming entirely browser side and getInitialProps wont receive a headers object. it will come directly from browser
    });
  }
};

export default customAxios;
