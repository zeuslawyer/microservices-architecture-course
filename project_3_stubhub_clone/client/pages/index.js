const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in {currentUser.email}!</h1>
  ) : (
    <h1>You need to sign in...</h1>
  );
};

// custom NextJs API to do some work while NextJs is building up the HTML to render back
// often done to fetch data for the initial / first load of page
// this function is run by the SERVER on initial load, reload etc,  and in the BROWSER/CLIENT when navigating between pages of the client app .
LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default LandingPage;
