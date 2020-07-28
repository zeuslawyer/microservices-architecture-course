const OrderIndex = ({ orders }) => {
  return (
    <ul>
      {orders
        .sort((a, b) => b - a)
        .map(order => (
          <li key={order.id}>
            {" "}
            {order.ticket.title} - {order.status}
          </li>
        ))}
    </ul>
  );
};

OrderIndex.getInitialProps = async (ctx, axiosClient) => {
  const { data } = await axiosClient.get("/api/orders");

  return { orders: data };
};
export default OrderIndex;
