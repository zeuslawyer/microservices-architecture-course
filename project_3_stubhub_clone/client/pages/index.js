import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map(t => {
    return (
      <tr key={t.id}>
        <td>{t.title}</td>
        <td>{t.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${t.id}`}>
            <a>Go</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

// custom NextJs API to do some work while NextJs is building up the HTML to render back
// often done to fetch data for the initial / first load of page
// this function is run by the SERVER on initial load, reload etc,  and in the BROWSER/CLIENT when navigating between pages of the client app .
LandingPage.getInitialProps = async (context, axiosClient, currentUser) => {
  const { data } = await axiosClient.get("/api/tickets");

  return {
    tickets: data,
  };
};

export default LandingPage;
