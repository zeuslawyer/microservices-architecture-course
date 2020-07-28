import "bootstrap/dist/css/bootstrap.css";
import customAxios from "../api/customAxios";
import Header from "../components/Header";

// this component wraps the actual component to be rendered and injects certain app-level things (like bootstrap, or headers ) into it
// therefore the .getInitialProps() func receives a different context object compared to regular NextJs components
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser}></Header>
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  );
};

// returns an object that gets passed into the AppComponent as props
AppComponent.getInitialProps = async appContext => {
  const axiosClient = customAxios(appContext.ctx);
  const { data } = await axiosClient.get("/api/users/currentuser");

  // call get initial props on whichever component is being rendered by Next JS
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      axiosClient,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data, // includes the currentUser property
  };
};

export default AppComponent;
