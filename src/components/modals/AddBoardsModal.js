import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Alert
} from 'reactstrap';

const AddBoardsModal = ({ isOpen, toggle }) => {
  const [formData, setFormData] = useState({ board: "", classes: [] , isActive:true});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const classesList = [
    { value: "1", label: "Class 1" },
    { value: "2", label: "Class 2" },
    { value: "3", label: "Class 3" },
    { value: "4", label: "Class 4" },
    { value: "5", label: "Class 5" },
    { value: "6", label: "Class 6" },
    { value: "7", label: "Class 7" },
    { value: "8", label: "Class 8" },
    { value: "9", label: "Class 9" },
    { value: "10", label: "Class 10" },
    { value: "11", label: "Class 11" },
    { value: "12", label: "Class 12" },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "classes") {
      // handle checkbox selections
      setFormData((prev) => {
        let updated = [...prev.classes];
        if (checked) {
          updated.push(value);
        } else {
          updated = updated.filter((item) => item !== value);
        }
        return { ...prev, classes: updated };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = () => {
    console.log("Submitting:", formData);
    setIsSubmitting(true);
    // validation + API call can go here
  };

  const handleClose = () => {
    setFormData({
      board: '',
      classes: [],
    });
    setErrors({});
    toggle();
  };


  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Add Board</ModalHeader>
      <ModalBody>
        <Form>
          {errors.submit && <Alert color="danger">{errors.submit}</Alert>}
          
          <Col>
            <FormGroup>
              <Label>Board Name</Label>
              <Input
                type="text"
                name="board"
                value={formData.board}
                onChange={handleInputChange}
                placeholder="Enter board name"
              />
            </FormGroup>
          </Col>

          <Col>
            <Label>Classes</Label>
            <div
              style={{
                maxHeight: "150px",
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "10px",
              }}
            >
              {classesList.map((cls) => (
                <div key={cls.value} className="form-check">
                  <Input
                    type="checkbox"
                    name="classes"
                    value={cls.value}
                    checked={formData.classes.includes(cls.value)}
                    onChange={handleInputChange}
                  />
                  <Label check className="ms-2">{cls.label}</Label>
                </div>
              ))}
            </div>
          </Col>
        </Form>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Board"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddBoardsModal;
