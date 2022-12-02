import { Button } from "react-bootstrap";

const Addbutton = ({ size, onClick, display }) => {
  return (
    <Button className="rounded-circle float-end " size={size} style={{ background: "#06d6a0", display: `${display}` }} onClick={onClick}>
      <i className="fa-solid fa-plus fa-sm"></i>
    </Button>
  );
};

export default Addbutton;
