import React, { useState, useEffect } from 'react';
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

const EditBoardsModal = ({ isOpen, toggle, onUpdateBoard, boardData }) => {
  const [formData, setFormData] = useState({
    board: "",
    classes: {}, // <-- stores { "1": { subject: [...] } }
    isActive: true
  });
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

  // Initialize form data when boardData changes
  useEffect(() => {
    if (boardData && isOpen) {
      setFormData({
        board: boardData.board || "",
        classes: boardData.classes || {},
        isActive: boardData.isActive !== undefined ? boardData.isActive : true
      });
      setErrors({});
    }
  }, [boardData, isOpen]);

  // Handle board name
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle class selection toggle
  const handleClassToggle = (e) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      const updatedClasses = { ...prev.classes };
      if (checked) {
        updatedClasses[value] = { subject: [] };
      } else {
        delete updatedClasses[value];
      }
      return { ...prev, classes: updatedClasses };
    });
  };

  // Add a subject under a class
  const handleAddSubject = (classValue) => {
    setFormData((prev) => ({
      ...prev,
      classes: {
        ...prev.classes,
        [classValue]: {
          subject: [...(prev.classes[classValue]?.subject || []), ""],
        },
      },
    }));
  };

  // Update a specific subject text
  const handleSubjectChange = (classValue, index, value) => {
    setFormData((prev) => {
      const updatedSubjects = [...(prev.classes[classValue]?.subject || [])];
      updatedSubjects[index] = value;

      return {
        ...prev,
        classes: {
          ...prev.classes,
          [classValue]: { subject: updatedSubjects },
        },
      };
    });
  };

  // Remove a specific subject field
  const handleRemoveSubject = (classValue, index) => {
    setFormData((prev) => {
      const updatedSubjects = [...(prev.classes[classValue]?.subject || [])];
      updatedSubjects.splice(index, 1);

      return {
        ...prev,
        classes: {
          ...prev.classes,
          [classValue]: { subject: updatedSubjects },
        },
      };
    });
  };

  // Final submission
  const handleSubmit = async () => {
    // Validate form data
    const validationErrors = {};
    
    if (!formData.board.trim()) {
      validationErrors.board = "Board name is required";
    }
    
    if (Object.keys(formData.classes).length === 0) {
      validationErrors.classes = "At least one class must be selected";
    }
    
    // Check if any selected class has empty subjects
    for (const classKey in formData.classes) {
      const subjects = formData.classes[classKey].subject;
      if (subjects.length === 0 || subjects.some(subject => !subject.trim())) {
        validationErrors.subjects = "All selected classes must have at least one subject";
        break;
      }
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      setErrors({});
      
      // Prepare data for API call
      const updateData = {
        board: formData.board.trim(),
        classes: formData.classes,
        isActive: formData.isActive
      };
      
      console.log("Updating board data:", updateData);
      
      // Call the API to update board
      await onUpdateBoard(boardData.id, updateData);
      
      // Close modal on success
      toggle();
      
    } catch (error) {
      console.error("Error updating board:", error);
      setErrors({ submit: "Failed to update board. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ board: "", classes: {}, isActive: true });
    setErrors({});
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg">
      <ModalHeader toggle={handleClose}>Edit Board</ModalHeader>
      <ModalBody>
        <Form>
          {errors.submit && <Alert color="danger">{errors.submit}</Alert>}

          {/* Board Name */}
          <Col>
            <FormGroup>
              <Label>Board Name</Label>
              <Input
                type="text"
                name="board"
                value={formData.board}
                onChange={handleInputChange}
                placeholder="Enter board name"
                invalid={!!errors.board}
              />
              {errors.board && <div className="invalid-feedback d-block">{errors.board}</div>}
            </FormGroup>
          </Col>

          {/* Classes selection */}
          <Col>
            <Label>Classes</Label>
            <div
              style={{
                maxHeight: "150px",
                overflowY: "auto",
                border: errors.classes ? "1px solid #dc3545" : "1px solid #ddd",
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
                    checked={!!formData.classes[cls.value]}
                    onChange={handleClassToggle}
                  />
                  <Label check className="ms-2">{cls.label}</Label>
                </div>
              ))}
            </div>
            {errors.classes && <div className="text-danger small mt-1">{errors.classes}</div>}
            {errors.subjects && <div className="text-danger small mt-1">{errors.subjects}</div>}
          </Col>

          {/* Subjects for each selected class */}
          {Object.keys(formData.classes).length > 0 && (
            <div className="mt-4">
              <h5>Subjects per Class</h5>
              {Object.keys(formData.classes).map((classValue) => (
                <div
                  key={classValue}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <strong>
                    {classesList.find((c) => c.value === classValue)?.label}
                  </strong>

                  {(formData.classes[classValue]?.subject || []).map(
                    (subject, index) => (
                      <div key={index} className="d-flex align-items-center my-2">
                        <Input
                          type="text"
                          value={subject}
                          onChange={(e) =>
                            handleSubjectChange(
                              classValue,
                              index,
                              e.target.value
                            )
                          }
                          placeholder="Enter subject name"
                        />
                        <Button
                          color="danger"
                          size="sm"
                          className="ms-2"
                          onClick={() =>
                            handleRemoveSubject(classValue, index)
                          }
                        >
                          ❌
                        </Button>
                      </div>
                    )
                  )}

                  <Button
                    color="secondary"
                    size="sm"
                    onClick={() => handleAddSubject(classValue)}
                  >
                    + Add Subject
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Form>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Board"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditBoardsModal;
