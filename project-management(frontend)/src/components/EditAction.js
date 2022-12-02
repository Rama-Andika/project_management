import { Button } from "react-bootstrap";

const EditAction = ({ onEdit,disabled }) => {
  return (
    <>
      <Button className="me-3 mb-3" variant="warning" onClick={onEdit} disabled={disabled}>
        <i className="fa-solid fa-pen-to-square fa-2xs"></i>
      </Button>
    </>
  );
};

export default EditAction;
