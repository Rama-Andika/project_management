import { Button } from "react-bootstrap";

const DeleteAction = ({ onDelete, display }) => {
  return (
    <>
      <Button className="me-3 mb-3" variant="danger" onClick={onDelete} style={{ display: display }}>
        <i className="fa-solid fa-trash fa-2xs"></i>
      </Button>
    </>
  );
};

export default DeleteAction;
