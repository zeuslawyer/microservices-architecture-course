import useRequest from "../../hooks/useRequest";
import Router from "next/router";

const TicketShow = ({ ticket }) => {
  const onSuccess = order => {
    console.log("ORDER", order);
    Router.push("/orders/[orderId]", `/orders/${order.id}`);
  };
  const [makeRequest, errorsJsx] = useRequest(
    "/api/orders",
    "post",
    { ticketId: ticket.id },
    onSuccess
  );
  return (
    <>
      <h1>{ticket.title}</h1>
      <h4>Price: ${ticket.price}</h4>
      {errorsJsx}
      <button className="btn btn-primary" onClick={makeRequest}>
        Purchase
      </button>
    </>
  );
};

TicketShow.getInitialProps = async (context, axiosClient) => {
  // get the ticket Id
  const { ticketId } = context.query; // query has properties equal to the filename wildcard param
  const { data } = await axiosClient.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};
export default TicketShow;
