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
  Alert,
  Card,
  CardBody,
  Row,
  Badge,
  InputGroup,
  InputGroupText,
  Collapse
} from 'reactstrap';

const EnhancedAddBoardsModal = ({ isOpen, toggle, onAddBoard }) => {
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
      const newClasses = { ...prev.classes };
      if (checked) {
        newClasses[classNumber] = { subjects: {} };
      } else {
        delete newClasses[classNumber];
      }
      return { ...prev, classes: newClasses };
    });

    // Toggle expanded state
    setExpandedClasses(prev => ({
      ...prev,
      [classNumber]: checked
    }));
  };

  // Handle subject addition for a class
  const handleAddSubject = (classNumber) => {
    setShowSubjectForm(prev => ({ ...prev, [classNumber]: true }));
    setNewSubjectData(prev => ({ ...prev, [classNumber]: { name: "" } }));
  };

  const handleSubjectFormSubmit = (classNumber) => {
    const subjectName = newSubjectData[classNumber]?.name?.trim();
    if (subjectName) {
      setFormData((prev) => ({
        ...prev,
        classes: {
          ...prev.classes,
          [classNumber]: {
            ...prev.classes[classNumber],
            subjects: {
              ...prev.classes[classNumber].subjects,
              [subjectName]: { books: [] }
            }
          }
        }
      }));
      setShowSubjectForm(prev => ({ ...prev, [classNumber]: false }));
      setNewSubjectData(prev => ({ ...prev, [classNumber]: { name: "" } }));
    }
  };

  const handleSubjectFormCancel = (classNumber) => {
    setShowSubjectForm(prev => ({ ...prev, [classNumber]: false }));
    setNewSubjectData(prev => ({ ...prev, [classNumber]: { name: "" } }));
  };

  // Handle book addition for a subject
  const handleAddBook = (classNumber, subjectName) => {
    const key = `${classNumber}_${subjectName}`;
    setShowBookForm(prev => ({ ...prev, [key]: true }));
    setNewBookData(prev => ({ ...prev, [key]: { name: "", book_id: "" } }));
  };

  const handleBookFormSubmit = (classNumber, subjectName) => {
    const key = `${classNumber}_${subjectName}`;
    const bookData = newBookData[key];
    if (bookData?.name?.trim() && bookData?.book_id?.trim()) {
      setFormData((prev) => ({
        ...prev,
        classes: {
          ...prev.classes,
          [classNumber]: {
            ...prev.classes[classNumber],
            subjects: {
              ...prev.classes[classNumber].subjects,
              [subjectName]: {
                ...prev.classes[classNumber].subjects[subjectName],
                books: [
                  ...prev.classes[classNumber].subjects[subjectName].books,
                  {
                    name: bookData.name.trim(),
                    book_id: bookData.book_id.trim(),
                    topics: []
                  }
                ]
              }
            }
          }
        }
      }));
      setShowBookForm(prev => ({ ...prev, [key]: false }));
      setNewBookData(prev => ({ ...prev, [key]: { name: "", book_id: "" } }));
    }
  };

  const handleBookFormCancel = (classNumber, subjectName) => {
    const key = `${classNumber}_${subjectName}`;
    setShowBookForm(prev => ({ ...prev, [key]: false }));
    setNewBookData(prev => ({ ...prev, [key]: { name: "", book_id: "" } }));
  };

  // Handle topic addition for a book
  const handleAddTopic = (classNumber, subjectName, bookIndex) => {
    const key = `${classNumber}_${subjectName}_${bookIndex}`;
    setShowTopicForm(prev => ({ ...prev, [key]: true }));
    setNewTopicData(prev => ({ ...prev, [key]: { name: "", topicNumber: "" } }));
  };

  const handleTopicFormSubmit = (classNumber, subjectName, bookIndex) => {
    const key = `${classNumber}_${subjectName}_${bookIndex}`;
    const topicData = newTopicData[key];
    if (topicData?.name?.trim() && topicData?.topicNumber?.trim()) {
      setFormData((prev) => ({
        ...prev,
        classes: {
          ...prev.classes,
          [classNumber]: {
            ...prev.classes[classNumber],
            subjects: {
              ...prev.classes[classNumber].subjects,
              [subjectName]: {
                ...prev.classes[classNumber].subjects[subjectName],
                books: prev.classes[classNumber].subjects[subjectName].books.map((book, index) => 
                  index === bookIndex 
                    ? {
                        ...book,
                        topics: [
                          ...book.topics,
                          {
                            topicNumber: parseInt(topicData.topicNumber),
                            name: topicData.name.trim()
                          }
                        ]
                      }
                    : book
                )
              }
            }
          }
        }
      }));
      setShowTopicForm(prev => ({ ...prev, [key]: false }));
      setNewTopicData(prev => ({ ...prev, [key]: { name: "", topicNumber: "" } }));
    }
  };

  const handleTopicFormCancel = (classNumber, subjectName, bookIndex) => {
    const key = `${classNumber}_${subjectName}_${bookIndex}`;
    setShowTopicForm(prev => ({ ...prev, [key]: false }));
    setNewTopicData(prev => ({ ...prev, [key]: { name: "", topicNumber: "" } }));
  };

  // Handle removal functions
  const handleRemoveSubject = (classNumber, subjectName) => {
    if (window.confirm(`Remove subject "${subjectName}"?`)) {
      setFormData((prev) => {
        const newSubjects = { ...prev.classes[classNumber].subjects };
        delete newSubjects[subjectName];
        return {
          ...prev,
          classes: {
            ...prev.classes,
            [classNumber]: {
              ...prev.classes[classNumber],
              subjects: newSubjects
            }
          }
        };
      });
    }
  };

  const handleRemoveBook = (classNumber, subjectName, bookIndex) => {
    if (window.confirm("Remove this book?")) {
      setFormData((prev) => ({
        ...prev,
        classes: {
          ...prev.classes,
          [classNumber]: {
            ...prev.classes[classNumber],
            subjects: {
              ...prev.classes[classNumber].subjects,
              [subjectName]: {
                ...prev.classes[classNumber].subjects[subjectName],
                books: prev.classes[classNumber].subjects[subjectName].books.filter((_, index) => index !== bookIndex)
              }
            }
          }
        }
      }));
    }
  };

  const handleRemoveTopic = (classNumber, subjectName, bookIndex, topicIndex) => {
    if (window.confirm("Remove this topic?")) {
      setFormData((prev) => ({
        ...prev,
        classes: {
          ...prev.classes,
          [classNumber]: {
            ...prev.classes[classNumber],
            subjects: {
              ...prev.classes[classNumber].subjects,
              [subjectName]: {
                ...prev.classes[classNumber].subjects[subjectName],
                books: prev.classes[classNumber].subjects[subjectName].books.map((book, index) => 
                  index === bookIndex 
                    ? {
                        ...book,
                        topics: book.topics.filter((_, tIndex) => tIndex !== topicIndex)
                      }
                    : book
                )
              }
            }
          }
        }
      }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.board.trim()) {
      newErrors.board = "Board name is required";
    }

    if (Object.keys(formData.classes).length === 0) {
      newErrors.classes = "At least one class must be selected";
    }

    // Validate each class has at least one subject
    for (const [classNumber, classData] of Object.entries(formData.classes)) {
      if (Object.keys(classData.subjects).length === 0) {
        newErrors[`class_${classNumber}`] = `Class ${classNumber} must have at least one subject`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const boardData = {
        board: formData.board.trim(),
        classes: formData.classes,
        isActive: formData.isActive,
        createdAt: new Date().toISOString()
      };
      
      console.log("Submitting enhanced board data:", boardData);
      
      await onAddBoard(boardData);
      
      // Reset form and close modal on success
      setFormData({ board: "", classes: {}, isActive: true });
      setErrors({});
      setExpandedClasses({});
      toggle();
      
    } catch (error) {
      console.error("Error adding board:", error);
      setErrors({ submit: "Failed to add board. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setFormData({ board: "", classes: {}, isActive: true });
    setErrors({});
    setExpandedClasses({});
    toggle();
  };

  // Get total counts
  const getTotalCounts = () => {
    let totalSubjects = 0;
    let totalBooks = 0;
    let totalTopics = 0;

    Object.values(formData.classes).forEach(classData => {
      Object.values(classData.subjects).forEach(subjectData => {
        totalSubjects++;
        subjectData.books.forEach(book => {
          totalBooks++;
          totalTopics += book.topics.length;
        });
      });
    });

    return { totalSubjects, totalBooks, totalTopics };
  };

  const counts = getTotalCounts();

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="xl">
      <ModalHeader toggle={handleClose}>
        <i className="fas fa-plus-circle me-2"></i>
        Add New Board with Complete Structure
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          {/* Board Name */}
          <FormGroup row>
            <Label for="board" sm={3}>
              Board Name <span className="text-danger">*</span>
            </Label>
            <Col sm={9}>
              <Input
                type="text"
                name="board"
                id="board"
                value={formData.board}
                onChange={handleInputChange}
                placeholder="e.g., CBSE, ICSE, State Board"
                invalid={!!errors.board}
              />
              {errors.board && <Alert color="danger" className="mt-2">{errors.board}</Alert>}
            </Col>
          </FormGroup>

          {/* Active Status */}
          <FormGroup row>
            <Label for="isActive" sm={3}>
              Status
            </Label>
            <Col sm={9}>
              <Input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <Label for="isActive" className="ms-2">Active</Label>
            </Col>
          </FormGroup>

          {/* Classes Selection */}
          <FormGroup row>
            <Label sm={3}>
              Classes <span className="text-danger">*</span>
            </Label>
            <Col sm={9}>
              <Row>
                {classesList.map((cls) => (
                  <Col md={4} key={cls.value} className="mb-2">
                    <div className="form-check">
                      <Input
                        type="checkbox"
                        id={`class_${cls.value}`}
                        value={cls.value}
                        checked={!!formData.classes[cls.value]}
                        onChange={handleClassToggle}
                      />
                      <Label for={`class_${cls.value}`} className="form-check-label">
                        {cls.label}
                      </Label>
                    </div>
                  </Col>
                ))}
              </Row>
              {errors.classes && <Alert color="danger" className="mt-2">{errors.classes}</Alert>}
            </Col>
          </FormGroup>

          {/* Structure Summary */}
          {counts.totalSubjects > 0 && (
            <Card className="mb-4">
              <CardBody>
                <h6 className="mb-3">📊 Structure Summary</h6>
                <Row>
                  <Col md={4}>
                    <Badge color="info" className="p-2">
                      <i className="fas fa-graduation-cap me-1"></i>
                      {Object.keys(formData.classes).length} Classes
                    </Badge>
                  </Col>
                  <Col md={4}>
                    <Badge color="warning" className="p-2">
                      <i className="fas fa-book me-1"></i>
                      {counts.totalSubjects} Subjects
                    </Badge>
                  </Col>
                  <Col md={4}>
                    <Badge color="success" className="p-2">
                      <i className="fas fa-book-open me-1"></i>
                      {counts.totalBooks} Books
                    </Badge>
                  </Col>
                </Row>
                {counts.totalTopics > 0 && (
                  <Row className="mt-2">
                    <Col md={4}>
                      <Badge color="primary" className="p-2">
                        <i className="fas fa-bookmark me-1"></i>
                        {counts.totalTopics} Topics
                      </Badge>
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          )}

          {/* Classes Structure */}
          {Object.keys(formData.classes).map((classNumber) => (
            <Card key={classNumber} className="mb-3">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">
                    <i className="fas fa-graduation-cap me-2"></i>
                    Class {classNumber}
                  </h6>
                  {!showSubjectForm[classNumber] && (
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => handleAddSubject(classNumber)}
                    >
                      <i className="fas fa-plus me-1"></i>
                      Add Subject
                    </Button>
                  )}
                </div>

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

                {Object.keys(formData.classes[classNumber].subjects).map((subjectName) => (
                  <Card key={subjectName} className="mb-2">
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0 text-warning">
                          <i className="fas fa-book me-2"></i>
                          {subjectName}
                        </h6>
                        <div>
                          {!showBookForm[`${classNumber}_${subjectName}`] && (
                            <Button
                              color="success"
                              size="sm"
                              className="me-2"
                              onClick={() => handleAddBook(classNumber, subjectName)}
                            >
                              <i className="fas fa-plus me-1"></i>
                              Add Book
                            </Button>
                          )}
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleRemoveSubject(classNumber, subjectName)}
                          >
                            <i className="fas fa-trash"></i>
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
                              <Col md={4}>
                                <Label className="form-label">Book Name</Label>
                                <Input
                                  type="text"
                                  placeholder="e.g., Mridang (NCERT)"
                                  value={newBookData[`${classNumber}_${subjectName}`]?.name || ""}
                                  onChange={(e) => handleNewBookInputChange(classNumber, subjectName, 'name', e.target.value)}
                                />
                              </Col>
                              <Col md={4}>
                                <Label className="form-label">Book ID</Label>
                                <Input
                                  type="text"
                                  placeholder="e.g., C1ENG0MRIDANG0NCERT"
                                  value={newBookData[`${classNumber}_${subjectName}`]?.book_id || ""}
                                  onChange={(e) => handleNewBookInputChange(classNumber, subjectName, 'book_id', e.target.value)}
                                />
                              </Col>
                              <Col md={4}>
                                <Label className="form-label">&nbsp;</Label>
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

                      {formData.classes[classNumber].subjects[subjectName].books.map((book, bookIndex) => (
                        <Card key={bookIndex} className="mb-2">
                          <CardBody>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div>
                                <strong className="text-success">{book.name}</strong>
                                <br />
                                <small className="text-muted">ID: {book.book_id}</small>
                              </div>
                              <div>
                                {!showTopicForm[`${classNumber}_${subjectName}_${bookIndex}`] && (
                                  <Button
                                    color="info"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleAddTopic(classNumber, subjectName, bookIndex)}
                                  >
                                    <i className="fas fa-plus me-1"></i>
                                    Add Topic
                                  </Button>
                                )}
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={() => handleRemoveBook(classNumber, subjectName, bookIndex)}
                                >
                                  <i className="fas fa-trash"></i>
                                </Button>
                              </div>
                            </div>

                            {/* Topic Form */}
                            {showTopicForm[`${classNumber}_${subjectName}_${bookIndex}`] && (
                              <Card className="mb-3 border-info">
                                <CardBody>
                                  <h6 className="mb-3 text-info">
                                    <i className="fas fa-plus-circle me-2"></i>
                                    Add New Topic
                                  </h6>
                                  <Row>
                                    <Col md={3}>
                                      <Label className="form-label">Topic Number</Label>
                                      <Input
                                        type="number"
                                        placeholder="1"
                                        value={newTopicData[`${classNumber}_${subjectName}_${bookIndex}`]?.topicNumber || ""}
                                        onChange={(e) => handleNewTopicInputChange(classNumber, subjectName, bookIndex, 'topicNumber', e.target.value)}
                                      />
                                    </Col>
                                    <Col md={6}>
                                      <Label className="form-label">Topic Name</Label>
                                      <Input
                                        type="text"
                                        placeholder="e.g., Two Little Hands"
                                        value={newTopicData[`${classNumber}_${subjectName}_${bookIndex}`]?.name || ""}
                                        onChange={(e) => handleNewTopicInputChange(classNumber, subjectName, bookIndex, 'name', e.target.value)}
                                      />
                                    </Col>
                                    <Col md={3}>
                                      <Label className="form-label">&nbsp;</Label>
                                      <div className="d-flex gap-2">
                                        <Button
                                          color="info"
                                          size="sm"
                                          onClick={() => handleTopicFormSubmit(classNumber, subjectName, bookIndex)}
                                          disabled={!newTopicData[`${classNumber}_${subjectName}_${bookIndex}`]?.name?.trim() || !newTopicData[`${classNumber}_${subjectName}_${bookIndex}`]?.topicNumber?.trim()}
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

                            {book.topics.length > 0 && (
                              <div>
                                <h6 className="mb-2">Topics:</h6>
                                <div className="row">
                                  {book.topics.map((topic, topicIndex) => (
                                    <Col md={6} key={topicIndex} className="mb-1">
                                      <div className="d-flex justify-content-between align-items-center p-2 border rounded">
                                        <span>
                                          <Badge color="primary" className="me-2">{topic.topicNumber}</Badge>
                                          {topic.name}
                                        </span>
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
                ))}
              </CardBody>
            </Card>
          ))}

          {errors.submit && (
            <Alert color="danger" className="mt-3">
              {errors.submit}
            </Alert>
          )}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          color="primary" 
          onClick={handleSubmit}
          disabled={isSubmitting || Object.keys(formData.classes).length === 0}
        >
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin me-2"></i>
              Adding Board...
            </>
          ) : (
            <>
              <i className="fas fa-plus me-2"></i>
              Add Board
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EnhancedAddBoardsModal;
