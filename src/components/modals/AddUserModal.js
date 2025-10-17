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
  Row,
  Col,
  Alert
} from 'reactstrap';

const AddUserModal = ({ isOpen, toggle, onAddUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    schoolName: '',
    credits: 5,
    uid: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (!formData.schoolName.trim()) {
      newErrors.schoolName = 'School name is required';
    }
    
    if (!formData.uid.trim()) {
      newErrors.uid = 'UID is required';
    }
    
    if (formData.credits < 0) {
      newErrors.credits = 'Credits cannot be negative';
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
      // Generate a unique UID if not provided
      const userData = {
        ...formData,
        uid: formData.uid || `USR${Date.now().toString().slice(-6)}`,
        credits: parseInt(formData.credits) || 0
      };
      
      // Call the parent component's add user function
      await onAddUser(userData);
      
      // Reset form and close modal
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        schoolName: '',
        credits: 0,
        uid: ''
      });
      setErrors({});
      toggle();
      
    } catch (error) {
      console.error('Error adding user:', error);
      setErrors({ submit: 'Failed to add user. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      schoolName: '',
      credits: 0,
      uid: ''
    });
    setErrors({});
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg">
      <ModalHeader toggle={handleClose}>
        Add New User
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {errors.submit && (
            <Alert color="danger">
              {errors.submit}
            </Alert>
          )}
          
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
                  <div className="invalid-feedback d-block">
                    {errors.name}
                  </div>
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
                  <div className="invalid-feedback d-block">
                    {errors.email}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>
          
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="phoneNumber">Phone Number *</Label>
                <Input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  invalid={!!errors.phoneNumber}
                />
                {errors.phoneNumber && (
                  <div className="invalid-feedback d-block">
                    {errors.phoneNumber}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="schoolName">School Name *</Label>
                <Input
                  type="text"
                  name="schoolName"
                  id="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  invalid={!!errors.schoolName}
                />
                {errors.schoolName && (
                  <div className="invalid-feedback d-block">
                    {errors.schoolName}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>
          
          <Row>
        
            <Col md="6">
              <FormGroup>
                <Label for="credits">Initial Credits</Label>
                <Input
                  type="number"
                  name="credits"
                  id="credits"
                  value={formData.credits}
                  onChange={handleInputChange}
                  min="0"
                  invalid={!!errors.credits}
                />
                {errors.credits && (
                  <div className="invalid-feedback d-block">
                    {errors.credits}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        
        <ModalFooter>
          <Button color="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add User'}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
