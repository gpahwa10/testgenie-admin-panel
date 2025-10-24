import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Row,
  Col,
  Collapse
} from 'reactstrap';

const BoardDetailsModal = ({ isOpen, toggle, boardData }) => {
  if (!boardData) return null;

  const getTotalCounts = () => {
    let totalClasses = 0;
    let totalSubjects = 0;
    let totalBooks = 0;
    let totalTopics = 0;

    if (boardData.classes) {
      totalClasses = Object.keys(boardData.classes).length;
      
      Object.values(boardData.classes).forEach(classData => {
        if (classData.subjects) {
          totalSubjects += Object.keys(classData.subjects).length;
          
          Object.values(classData.subjects).forEach(subject => {
            if (subject.books) {
              totalBooks += subject.books.length;
              subject.books.forEach(book => {
                if (book.topics) {
                  totalTopics += book.topics.length;
                }
              });
            }
          });
        }
      });
    }

    return { totalClasses, totalSubjects, totalBooks, totalTopics };
  };

  const counts = getTotalCounts();

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <i className="fas fa-info-circle me-2"></i>
        Board Details: {boardData.name}
      </ModalHeader>
      <ModalBody>
        {/* Board Summary */}
        <Card className="mb-4">
          <CardHeader className="bg-gradient-primary text-white">
            <h5 className="mb-0">
              <i className="fas fa-school me-2"></i>
              Board Summary
            </h5>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={3}>
                <div className="text-center">
                  <Badge color="primary" className="p-3 mb-2">
                    <i className="fas fa-graduation-cap fa-2x d-block mb-2"></i>
                    {counts.totalClasses} Classes
                  </Badge>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <Badge color="warning" className="p-3 mb-2">
                    <i className="fas fa-book fa-2x d-block mb-2"></i>
                    {counts.totalSubjects} Subjects
                  </Badge>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <Badge color="success" className="p-3 mb-2">
                    <i className="fas fa-book-open fa-2x d-block mb-2"></i>
                    {counts.totalBooks} Books
                  </Badge>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <Badge color="info" className="p-3 mb-2">
                    <i className="fas fa-bookmark fa-2x d-block mb-2"></i>
                    {counts.totalTopics} Topics
                  </Badge>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Detailed Structure */}
        {boardData.classes && Object.keys(boardData.classes).map((classNumber) => {
          const classData = boardData.classes[classNumber];
          const subjectCount = classData?.subjects ? Object.keys(classData.subjects).length : 0;
          let classBooks = 0;
          let classTopics = 0;

          if (classData?.subjects) {
            Object.values(classData.subjects).forEach(subject => {
              if (subject.books) {
                classBooks += subject.books.length;
                subject.books.forEach(book => {
                  if (book.topics) {
                    classTopics += book.topics.length;
                  }
                });
              }
            });
          }

          return (
            <Card key={classNumber} className="mb-3">
              <CardHeader className="bg-light">
                <h6 className="mb-0">
                  <i className="fas fa-graduation-cap me-2"></i>
                  Class {classNumber}
                  <Badge color="primary" className="ms-2">
                    {subjectCount} subjects, {classBooks} books, {classTopics} topics
                  </Badge>
                </h6>
              </CardHeader>
              <CardBody>
                {classData?.subjects && Object.entries(classData.subjects).map(([subjectName, subjectData]) => {
                  const bookCount = subjectData.books ? subjectData.books.length : 0;
                  let subjectTopics = 0;
                  
                  if (subjectData.books) {
                    subjectData.books.forEach(book => {
                      if (book.topics) {
                        subjectTopics += book.topics.length;
                      }
                    });
                  }

                  return (
                    <Card key={subjectName} className="mb-2">
                      <CardBody>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0 text-warning">
                            <i className="fas fa-book me-2"></i>
                            {subjectName}
                          </h6>
                          <Badge color="warning">
                            {bookCount} books, {subjectTopics} topics
                          </Badge>
                        </div>

                        {subjectData.books && subjectData.books.map((book, bookIndex) => (
                          <Card key={bookIndex} className="mb-2">
                            <CardBody>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <div>
                                  <strong className="text-success">{book.name}</strong>
                                  <br />
                                  <small className="text-muted">ID: {book.bookId}</small>
                                </div>
                                <Badge color="success">
                                  {book.topics ? book.topics.length : 0} topics
                                </Badge>
                              </div>

                              {book.topics && book.topics.length > 0 && (
                                <div>
                                  <h6 className="mb-2">Topics:</h6>
                                  <div className="row">
                                    {book.topics.map((topic, topicIndex) => (
                                      <Col md={6} key={topicIndex} className="mb-1">
                                        <div className="d-flex align-items-center p-2 border rounded">
                                          <Badge color="info" className="me-2">{topic.topicNumber}</Badge>
                                          <span>{topic.name}</span>
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
              </CardBody>
            </Card>
          );
        })}

        {(!boardData.classes || Object.keys(boardData.classes).length === 0) && (
          <Card>
            <CardBody className="text-center">
              <i className="fas fa-exclamation-triangle fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No classes found for this board</h5>
              <p className="text-muted">This board doesn't have any classes, subjects, books, or topics yet.</p>
            </CardBody>
          </Card>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default BoardDetailsModal;
