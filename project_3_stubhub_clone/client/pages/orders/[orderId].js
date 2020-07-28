import useRequest from "../../hooks/useRequest";
import React from "react";

const OrderShow = ({ order }) => {
  const { expiresAt } = order;

  // @ts-ignore

  const [timeLeft, setTimeLeft] = React.useState(0);

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      // @ts-ignore
      let msLeft = new Date(expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    calculateTimeLeft(); // initial time left render
    const timerId = setInterval(calculateTimeLeft, 1000); // repeated render

    // teardown timer
    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft <= 0) {
    return (
      <>
        <h5>
          Order for the title "{order.ticket.title}" has expired. Please
          purchase the ticket again.
        </h5>
      </>
    );
  }
  return (
    <>
      <h1>ORDER</h1>
      <h5>
        You have {timeLeft} seconds to pay for this order, after which the title
        "{order.ticket.title}" will be released for others to order.
      </h5>
    </>
  );
};

OrderShow.getInitialProps = async (context, axiosClient) => {
  // get the order
  const { orderId } = context.query; // query has properties equal to the filename wildcard param
  const { data } = await axiosClient.get(`/api/orders/${orderId}`);
  return { order: data };
};
export default OrderShow;
