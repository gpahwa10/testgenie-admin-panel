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
  Alert,
  Card,
  CardBody,
  Row,
  Badge,
  InputGroup,
  InputGroupText,
  Collapse
} from 'reactstrap';

const EnhancedEditBoardsModal = ({ isOpen, toggle, onUpdateBoard, boardData }) => {
  const [formData, setFormData] = useState({
    board: "",
    classes: {}, // { "1": { subjects: { "English": { books: [...] } } } }
    isActive: true
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedClasses, setExpandedClasses] = useState({});
  const [showSubjectForm, setShowSubjectForm] = useState({});
  const [showBookForm, setShowBookForm] = useState({});
  const [showTopicForm, setShowTopicForm] = useState({});
  
  // Form data for new items
  const [newSubjectData, setNewSubjectData] = useState({});
  const [newBookData, setNewBookData] = useState({});
  const [newTopicData, setNewTopicData] = useState({});

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

  const commonSubjects = [
    "English", "Hindi", "Maths", "Science", "Social Studies", 
    "Environmental Science", "Computer Science", "Art", "Music", "Physical Education"
  ];

  // Initialize form data when boardData changes
  useEffect(() => {
    if (boardData && isOpen) {
      // Transform the board data to match our form structure
      const transformedData = {
        board: boardData.name || boardData.board || "",
        classes: boardData.classes || {},
        isActive: boardData.isActive !== undefined ? boardData.isActive : true
      };
      
      setFormData(transformedData);
      setErrors({});
      
      // Initialize expanded classes for existing data
      const expanded = {};
      Object.keys(transformedData.classes).forEach(classKey => {
        expanded[classKey] = true;
      });
      setExpandedClasses(expanded);
    }
  }, [boardData, isOpen]);

  // Handle board name
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Handle form input changes for new items
  const handleNewSubjectInputChange = (classNumber, field, value) => {
    setNewSubjectData(prev => ({
      ...prev,
      [classNumber]: { ...prev[classNumber], [field]: value }
    }));
  };

  const handleNewBookInputChange = (classNumber, subjectName, field, value) => {
    const key = `${classNumber}_${subjectName}`;
    setNewBookData(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const handleNewTopicInputChange = (classNumber, subjectName, bookIndex, field, value) => {
    const key = `${classNumber}_${subjectName}_${bookIndex}`;
    setNewTopicData(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  // Handle class selection toggle
  const handleClassToggle = (e) => {
    const { value, checked } = e.target;
    const classNumber = value;

    setFormData((prev) => {
      const updatedClasses = { ...prev.classes };
      if (checked) {
        updatedClasses[classNumber] = { subjects: {} };
        setExpandedClasses(prev => ({ ...prev, [classNumber]: true }));
      } else {
        delete updatedClasses[classNumber];
        setExpandedClasses(prev => {
          const newExpanded = { ...prev };
          delete newExpanded[classNumber];
          return newExpanded;
        });
      }
      return { ...prev, classes: updatedClasses };
    });
  };

  // Toggle class expansion
  const toggleClassExpansion = (classNumber) => {
    setExpandedClasses(prev => ({
      ...prev,
      [classNumber]: !prev[classNumber]
    }));
  };

  // Add subject to class
  const handleAddSubject = (classNumber) => {
    setShowSubjectForm(prev => ({ ...prev, [classNumber]: true }));
  };

  const handleSubjectFormSubmit = (classNumber) => {
    const subjectData = newSubjectData[classNumber];
    if (subjectData?.name?.trim()) {
      setFormData(prev => ({
        ...prev,
        classes: {
          ...prev.classes,
          [classNumber]: {
            ...prev.classes[classNumber],
            subjects: {
              ...prev.classes[classNumber]?.subjects,
              [subjectData.name.trim()]: { books: [] }
            }
          }
        }
      }));
      
      // Reset form
      setNewSubjectData(prev => ({ ...prev, [classNumber]: { name: "" } }));
      setShowSubjectForm(prev => ({ ...prev, [classNumber]: false }));
    }
  };

  const handleSubjectFormCancel = (classNumber) => {
    setNewSubjectData(prev => ({ ...prev, [classNumber]: { name: "" } }));
    setShowSubjectForm(prev => ({ ...prev, [classNumber]: false }));
  };

  // Add book to subject
  const handleAddBook = (classNumber, subjectName) => {
    const key = `${classNumber}_${subjectName}`;
    setShowBookForm(prev => ({ ...prev, [key]: true }));
  };

  const handleBookFormSubmit = (classNumber, subjectName) => {
    const key = `${classNumber}_${subjectName}`;
    const bookData = newBookData[key];
    
    if (bookData?.name?.trim() && bookData?.book_id?.trim()) {
      const newBook = {
        name: bookData.name.trim(),
        book_id: bookData.book_id.trim(),
        topics: []
      };

      setFormData(prev => ({
        ...prev,
        classes: {
          ...prev.classes,
          [classNumber]: {
            ...prev.classes[classNumber],
            subjects: {
              ...prev.classes[classNumber].subjects,
              [subjectName]: {
                ...prev.classes[classNumber].subjects[subjectName],
                books: [...(prev.classes[classNumber].subjects[subjectName]?.books || []), newBook]
              }
            }
          }
        }
      }));
      
      // Reset form
      setNewBookData(prev => ({ ...prev, [key]: { name: "", book_id: "" } }));
      setShowBookForm(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleBookFormCancel = (classNumber, subjectName) => {
    const key = `${classNumber}_${subjectName}`;
    setNewBookData(prev => ({ ...prev, [key]: { name: "", book_id: "" } }));
    setShowBookForm(prev => ({ ...prev, [key]: false }));
  };

  // Add topic to book
  const handleAddTopic = (classNumber, subjectName, bookIndex) => {
    const key = `${classNumber}_${subjectName}_${bookIndex}`;
    setShowTopicForm(prev => ({ ...prev, [key]: true }));
  };

  const handleTopicFormSubmit = (classNumber, subjectName, bookIndex) => {
    const key = `${classNumber}_${subjectName}_${bookIndex}`;
    const topicData = newTopicData[key];
    
    if (topicData?.name?.trim()) {
      const newTopic = {
        topicNumber: (formData.classes[classNumber]?.subjects[subjectName]?.books[bookIndex]?.topics?.length || 0) + 1,
        name: topicData.name.trim()
      };

      setFormData(prev => {
        const updatedClasses = { ...prev.classes };
        const updatedBooks = [...updatedClasses[classNumber].subjects[subjectName].books];
        updatedBooks[bookIndex] = {
          ...updatedBooks[bookIndex],
          topics: [...(updatedBooks[bookIndex].topics || []), newTopic]
        };
        
        updatedClasses[classNumber].subjects[subjectName].books = updatedBooks;
        
        return {
          ...prev,
          classes: updatedClasses
        };
      });
      
      // Reset form
      setNewTopicData(prev => ({ ...prev, [key]: { name: "" } }));
      setShowTopicForm(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleTopicFormCancel = (classNumber, subjectName, bookIndex) => {
    const key = `${classNumber}_${subjectName}_${bookIndex}`;
    setNewTopicData(prev => ({ ...prev, [key]: { name: "" } }));
    setShowTopicForm(prev => ({ ...prev, [key]: false }));
  };

  // Remove subject
  const handleRemoveSubject = (classNumber, subjectName) => {
    setFormData(prev => {
      const updatedClasses = { ...prev.classes };
      const updatedSubjects = { ...updatedClasses[classNumber].subjects };
      delete updatedSubjects[subjectName];
      updatedClasses[classNumber].subjects = updatedSubjects;
      
      return {
        ...prev,
        classes: updatedClasses
      };
    });
  };

  // Remove book
  const handleRemoveBook = (classNumber, subjectName, bookIndex) => {
    setFormData(prev => {
      const updatedClasses = { ...prev.classes };
      const updatedBooks = [...updatedClasses[classNumber].subjects[subjectName].books];
      updatedBooks.splice(bookIndex, 1);
      updatedClasses[classNumber].subjects[subjectName].books = updatedBooks;
      
      return {
        ...prev,
        classes: updatedClasses
      };
    });
  };

  // Remove topic
  const handleRemoveTopic = (classNumber, subjectName, bookIndex, topicIndex) => {
    setFormData(prev => {
      const updatedClasses = { ...prev.classes };
      const updatedBooks = [...updatedClasses[classNumber].subjects[subjectName].books];
      const updatedTopics = [...updatedBooks[bookIndex].topics];
      updatedTopics.splice(topicIndex, 1);
      updatedBooks[bookIndex].topics = updatedTopics;
      updatedClasses[classNumber].subjects[subjectName].books = updatedBooks;
      
      return {
        ...prev,
        classes: updatedClasses
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
    
    // Check if any selected class has subjects
    for (const classKey in formData.classes) {
      const subjects = formData.classes[classKey]?.subjects || {};
      if (Object.keys(subjects).length === 0) {
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
      
      // Call the API to update board
      await onUpdateBoard(boardData.id, updateData);
      
      // Close modal on success
      handleClose();
      
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
    setExpandedClasses({});
    setShowSubjectForm({});
    setShowBookForm({});
    setShowTopicForm({});
    setNewSubjectData({});
    setNewBookData({});
    setNewTopicData({});
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="xl">
      <ModalHeader toggle={handleClose}>
        <i className="fas fa-edit me-2"></i>
        Edit Board: {boardData?.name || 'Board'}
      </ModalHeader>
      <ModalBody>
        <Form>
          {errors.submit && <Alert color="danger">{errors.submit}</Alert>}

          {/* Board Name */}
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="board">
                  <i className="fas fa-graduation-cap me-1"></i>
                  Board Name
                </Label>
                <Input
                  type="text"
                  name="board"
                  id="board"
                  value={formData.board}
                  onChange={handleInputChange}
                  placeholder="Enter board name (e.g., CBSE, ICSE, BIEAP)"
                  invalid={!!errors.board}
                />
                {errors.board && <div className="invalid-feedback d-block">{errors.board}</div>}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="isActive">
                  <i className="fas fa-toggle-on me-1"></i>
                  Board Status
                </Label>
                <Input
                  type="select"
                  name="isActive"
                  id="isActive"
                  value={formData.isActive}
                  onChange={handleInputChange}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>

          {/* Classes selection */}
          <FormGroup>
            <Label>
              <i className="fas fa-chalkboard-teacher me-1"></i>
              Select Classes
            </Label>
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                border: errors.classes ? "1px solid #dc3545" : "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                backgroundColor: "#f8f9fa"
              }}
            >
              <Row>
                {classesList.map((cls) => (
                  <Col md={4} key={cls.value} className="mb-2">
                    <div className="form-check">
                      <Input
                        type="checkbox"
                        name="classes"
                        value={cls.value}
                        checked={!!formData.classes[cls.value]}
                        onChange={handleClassToggle}
                        className="form-check-input"
                      />
                      <Label check className="form-check-label">
                        <i className="fas fa-graduation-cap me-1"></i>
                        {cls.label}
                      </Label>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
            {errors.classes && <div className="text-danger small mt-1">{errors.classes}</div>}
            {errors.subjects && <div className="text-danger small mt-1">{errors.subjects}</div>}
          </FormGroup>

          {/* Subjects, Books, and Topics for each selected class */}
          {Object.keys(formData.classes).length > 0 && (
            <div className="mt-4">
              <h5>
                <i className="fas fa-book me-2"></i>
                Classes & Content Structure
              </h5>
              {Object.keys(formData.classes).map((classNumber) => {
                const classData = formData.classes[classNumber];
                const isExpanded = expandedClasses[classNumber];
                const classInfo = classesList.find(c => c.value === classNumber);
                
                return (
                  <Card key={classNumber} className="mb-3">
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">
                          <i className="fas fa-chalkboard-teacher me-2"></i>
                          {classInfo?.label}
                        </h6>
                        <div className="d-flex gap-2">
                          <Button
                            color="primary"
                            size="sm"
                            onClick={() => handleAddSubject(classNumber)}
                          >
                            <i className="fas fa-plus me-1"></i>
                            Add Subject
                          </Button>
                          <Button
                            color="outline-secondary"
                            size="sm"
                            onClick={() => toggleClassExpansion(classNumber)}
                          >
                            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} me-1`}></i>
                            {isExpanded ? 'Collapse' : 'Expand'}
                          </Button>
                        </div>
                      </div>

                      <Collapse isOpen={isExpanded}>
                        {/* Subject Form */}
                        {showSubjectForm[classNumber] && (
                          <Card className="mb-3 border-primary">
                            <CardBody>
                              <h6 className="mb-3 text-primary">
                                <i className="fas fa-plus-circle me-2"></i>
                                Add New Subject
                              </h6>
                              <Row>
                                <Col md={8}>
                                  <Input
                                    type="text"
                                    placeholder="Enter subject name (e.g., English, Maths, Science)"
                                    value={newSubjectData[classNumber]?.name || ""}
                                    onChange={(e) => handleNewSubjectInputChange(classNumber, 'name', e.target.value)}
                                  />
                                </Col>
                                <Col md={4}>
                                  <div className="d-flex gap-2">
                                    <Button
                                      color="success"
                                      size="sm"
                                      onClick={() => handleSubjectFormSubmit(classNumber)}
                                      disabled={!newSubjectData[classNumber]?.name?.trim()}
                                    >
                                      <i className="fas fa-check me-1"></i>
                                      Add
                                    </Button>
                                    <Button
                                      color="secondary"
                                      size="sm"
                                      onClick={() => handleSubjectFormCancel(classNumber)}
                                    >
                                      <i className="fas fa-times me-1"></i>
                                      Cancel
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        )}

                        {/* Existing Subjects */}
                        {classData?.subjects && Object.keys(classData.subjects).map((subjectName) => {
                          const subjectData = classData.subjects[subjectName];
                          
                          return (
                            <Card key={subjectName} className="mb-3 border-warning">
                              <CardBody>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <h6 className="mb-0 text-warning">
                                    <i className="fas fa-book me-2"></i>
                                    {subjectName}
                                  </h6>
                                  <div className="d-flex gap-2">
                                    <Button
                                      color="success"
                                      size="sm"
                                      onClick={() => handleAddBook(classNumber, subjectName)}
                                    >
                                      <i className="fas fa-plus me-1"></i>
                                      Add Book
                                    </Button>
                                    <Button
                                      color="danger"
                                      size="sm"
                                      onClick={() => handleRemoveSubject(classNumber, subjectName)}
                                    >
                                      <i className="fas fa-trash me-1"></i>
                                      Remove
                                    </Button>
                                  </div>
                                </div>

                                {/* Book Form */}
                                {showBookForm[`${classNumber}_${subjectName}`] && (
                                  <Card className="mb-3 border-success">
                                    <CardBody>
                                      <h6 className="mb-3 text-success">
                                        <i className="fas fa-plus-circle me-2"></i>
                                        Add New Book
                                      </h6>
                                      <Row>
                                        <Col md={5}>
                                          <Input
                                            type="text"
                                            placeholder="Book name"
                                            value={newBookData[`${classNumber}_${subjectName}`]?.name || ""}
                                            onChange={(e) => handleNewBookInputChange(classNumber, subjectName, 'name', e.target.value)}
                                          />
                                        </Col>
                                        <Col md={4}>
                                          <Input
                                            type="text"
                                            placeholder="Book ID"
                                            value={newBookData[`${classNumber}_${subjectName}`]?.book_id || ""}
                                            onChange={(e) => handleNewBookInputChange(classNumber, subjectName, 'book_id', e.target.value)}
                                          />
                                        </Col>
                                        <Col md={3}>
                                          <div className="d-flex gap-2">
                                            <Button
                                              color="success"
                                              size="sm"
                                              onClick={() => handleBookFormSubmit(classNumber, subjectName)}
                                              disabled={!newBookData[`${classNumber}_${subjectName}`]?.name?.trim() || !newBookData[`${classNumber}_${subjectName}`]?.book_id?.trim()}
                                            >
                                              <i className="fas fa-check me-1"></i>
                                              Add
                                            </Button>
                                            <Button
                                              color="secondary"
                                              size="sm"
                                              onClick={() => handleBookFormCancel(classNumber, subjectName)}
                                            >
                                              <i className="fas fa-times me-1"></i>
                                              Cancel
                                            </Button>
                                          </div>
                                        </Col>
                                      </Row>
                                    </CardBody>
                                  </Card>
                                )}

                                {/* Existing Books */}
                                {subjectData?.books && subjectData.books.map((book, bookIndex) => (
                                  <Card key={bookIndex} className="mb-2 border-info">
                                    <CardBody>
                                      <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div>
                                          <strong className="text-info">{book.name}</strong>
                                          <br />
                                          <small className="text-muted">ID: {book.book_id}</small>
                                        </div>
                                        <div className="d-flex gap-2">
                                          <Button
                                            color="info"
                                            size="sm"
                                            onClick={() => handleAddTopic(classNumber, subjectName, bookIndex)}
                                          >
                                            <i className="fas fa-plus me-1"></i>
                                            Add Topic
                                          </Button>
                                          <Button
                                            color="danger"
                                            size="sm"
                                            onClick={() => handleRemoveBook(classNumber, subjectName, bookIndex)}
                                          >
                                            <i className="fas fa-trash me-1"></i>
                                            Remove
                                          </Button>
                                        </div>
                                      </div>

                                      {/* Topic Form */}
                                      {showTopicForm[`${classNumber}_${subjectName}_${bookIndex}`] && (
                                        <Card className="mb-2 border-primary">
                                          <CardBody>
                                            <h6 className="mb-2 text-primary">
                                              <i className="fas fa-plus-circle me-2"></i>
                                              Add New Topic
                                            </h6>
                                            <Row>
                                              <Col md={8}>
                                                <Input
                                                  type="text"
                                                  placeholder="Topic name"
                                                  value={newTopicData[`${classNumber}_${subjectName}_${bookIndex}`]?.name || ""}
                                                  onChange={(e) => handleNewTopicInputChange(classNumber, subjectName, bookIndex, 'name', e.target.value)}
                                                />
                                              </Col>
                                              <Col md={4}>
                                                <div className="d-flex gap-2">
                                                  <Button
                                                    color="success"
                                                    size="sm"
                                                    onClick={() => handleTopicFormSubmit(classNumber, subjectName, bookIndex)}
                                                    disabled={!newTopicData[`${classNumber}_${subjectName}_${bookIndex}`]?.name?.trim()}
                                                  >
                                                    <i className="fas fa-check me-1"></i>
                                                    Add
                                                  </Button>
                                                  <Button
                                                    color="secondary"
                                                    size="sm"
                                                    onClick={() => handleTopicFormCancel(classNumber, subjectName, bookIndex)}
                                                  >
                                                    <i className="fas fa-times me-1"></i>
                                                    Cancel
                                                  </Button>
                                                </div>
                                              </Col>
                                            </Row>
                                          </CardBody>
                                        </Card>
                                      )}

                                      {/* Existing Topics */}
                                      {book.topics && book.topics.length > 0 && (
                                        <div className="mt-2">
                                          <h6 className="mb-2">Topics:</h6>
                                          <div className="row">
                                            {book.topics.map((topic, topicIndex) => (
                                              <Col md={6} key={topicIndex} className="mb-1">
                                                <div className="d-flex align-items-center p-2 border rounded">
                                                  <Badge color="primary" className="me-2">{topic.topicNumber}</Badge>
                                                  <span className="flex-grow-1">{topic.name}</span>
                                                  <Button
                                                    color="danger"
                                                    size="sm"
                                                    onClick={() => handleRemoveTopic(classNumber, subjectName, bookIndex, topicIndex)}
                                                  >
                                                    <i className="fas fa-times"></i>
                                                  </Button>
                                                </div>
                                              </Col>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </CardBody>
                                  </Card>
                                ))}
                              </CardBody>
                            </Card>
                          );
                        })}
                      </Collapse>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </Form>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <i className="fas fa-times me-1"></i>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin me-1"></i>
              Updating...
            </>
          ) : (
            <>
              <i className="fas fa-save me-1"></i>
              Update Board
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EnhancedEditBoardsModal;
