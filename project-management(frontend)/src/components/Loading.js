import { Spinner } from "react-bootstrap";

const Loading = ({size}) => {
  return (
    <>
      <Spinner animation="border" size={size} role="status" />
      <span className="visually-hidden">...loading</span>
    </>
  );
};
export default Loading;
