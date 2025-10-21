import React, { useState } from "react";
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
  Row,
  Col,
  Alert,
} from "reactstrap";

const AddUserModal = ({ isOpen, toggle, onAddUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    school: "",
    credit: 5,
    uid: "",
    image: null, // optional
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.school.trim()) {
      newErrors.school = "School name is required";
    }

    if (formData.credit < 0) {
      newErrors.credit = "credit cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

      try {
        const { uid, ...userDataWithoutUid } = formData;
        const userData = {
          ...userDataWithoutUid,
          credit: parseInt(formData.credit) || 0,
        };

        console.log("Form data before submit:", formData);
        console.log("User data before submit (without uid):", userData);

      // Call the parent component's add user function
      await onAddUser(userData);

      // Reset form and close modal
      setFormData({
        name: "",
        email: "",
        phone: "",
        school: "",
        credit: 5,
        uid: "",
      });
      setErrors({});
      toggle();
    } catch (error) {
      console.error("Error adding user:", error);
      setErrors({ submit: "Failed to add user. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      school: "",
      credit: 0,
      uid: "",
      image: null,
    });
    setErrors({});
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg">
      <ModalHeader toggle={handleClose}>Add New User</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {errors.submit && <Alert color="danger">{errors.submit}</Alert>}

          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="name">Full Name *</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  invalid={!!errors.name}
                />
                {errors.name && (
                  <div className="invalid-feedback d-block">{errors.name}</div>
                )}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="email">Email Address *</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  invalid={!!errors.email}
                />
                {errors.email && (
                  <div className="invalid-feedback d-block">{errors.email}</div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="phone">Phone Number *</Label>
                <Input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  invalid={!!errors.phone}
                />
                {errors.phone && (
                  <div className="invalid-feedback d-block">
                    {errors.phone}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="school">School Name *</Label>
                <Input
                  type="text"
                  name="school"
                  id="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  invalid={!!errors.school}
                />
                {errors.school && (
                  <div className="invalid-feedback d-block">
                    {errors.school}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="credit">Initial credit</Label>
                <Input
                  type="number"
                  name="credit"
                  id="credit"
                  value={formData.credit}
                  onChange={handleInputChange}
                  min="0"
                  invalid={!!errors.credit}
                />
                {errors.credit && (
                  <div className="invalid-feedback d-block">
                    {errors.credit}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>

        <ModalFooter>
          <Button
            color="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add User"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
