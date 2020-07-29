import React from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/useRequest";
import Router from "next/router";

const onSuccess = payment => {
  Router.push("/orders");
};
const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [makeRequest, errorsJsx] = useRequest(
    "/api/payments",
    "post",
    {
      orderId: order.id,
    },
    onSuccess
  );

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      // @ts-ignore
      let msLeft = new Date(order.expiresAt) - new Date();
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
      <StripeCheckout
        token={token => {
          makeRequest({ token: token.id }).catch(console.error);
        }}
        stripeKey="pk_test_51DuUKTHkJBsa8PceDIjyuK9FfQJfhF16bT9ANNpEHJQn6X96Y55Btflyctok7qjswpaqJ9XLCERN5DOpWCzvftxZ00iHeNZYI2"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errorsJsx}
    </>
  );
};

OrderShow.getInitialProps = async (context, axiosClient, currentUser) => {
  // get the order
  const { orderId } = context.query; // query has properties equal to the filename wildcard param
  const { data } = await axiosClient.get(`/api/orders/${orderId}`);
  return { order: data, currentUser };
};
export default OrderShow;
