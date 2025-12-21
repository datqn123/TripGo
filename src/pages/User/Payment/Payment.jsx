import Payment_Flight from "./Payment_Flight";
import Payment_Hotel from "./Payment_Hotel";
import Payment_Tour from "./Payment_Tour";

const Payment = ({ type }) => {
  return (
    <>
      {type === "hotel" ? <Payment_Hotel /> : type === "tour" ? <Payment_Tour /> : <Payment_Flight />}
    </>
  );
};

export default Payment;
