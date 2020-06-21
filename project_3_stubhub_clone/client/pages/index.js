import axios from "axios";
import customAxios from "../api/customAxios";

const LandingPage = ({ currentUser }) => {
  console.log("props", currentUser);
  return <h1>Landing page!</h1>;
};

// custom NextJs API to do some work while NextJs is building up the HTML to render back
// often done to fetch data for the initial / first load of page
// this function is run by the SERVER on initial load, reload etc,  and in the BROWSER/CLIENT when navigating between pages of the client app .
LandingPage.getInitialProps = async context => {
  const axiosClient = customAxios(context);

  const path = "/api/users/currentuser";
  const response = await axiosClient.get(path);
  return response.data;
};

export default LandingPage;
