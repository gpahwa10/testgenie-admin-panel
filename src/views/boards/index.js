import React, { useEffect, useState, useCallback } from "react";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Table,
  Container,
  Row,
  Button,
  Alert,
} from "reactstrap";
import Switch from "react-switch";
import EnhancedAddBoardsModal from "components/modals/EnhancedAddBoardsModal";
import EnhancedEditBoardsModal from "components/modals/EnhancedEditBoardsModal";
import ConfirmDeleteModal from "components/modals/ConfirmDeleteModal";
import BoardDetailsModal from "components/modals/BoardDetailsModal";
import AccessiblePagination from "components/Pagination/AccessiblePagination";
import { boardServices } from "services/boardServices";
import { enhancedBoardServices } from "services/enhancedBoardServices";
const BoardsClasses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [boardToDelete, setBoardToDelete] = useState(null);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchBoards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch boards with complete structure using enhanced services
      const boardsData = await enhancedBoardServices.getAllBoards();
      
      // For each board, fetch its complete structure
      const boardsWithCompleteData = await Promise.all(
        boardsData.map(async (board) => {
          try {
            const completeData = await enhancedBoardServices.getCompleteBoard(board.id);
            return completeData;
          } catch (error) {
            console.warn(`Could not fetch complete data for board ${board.id}:`, error);
            return board; // Return basic board data if complete fetch fails
          }
        })
      );
      
      setBoards(boardsWithCompleteData);
    } catch (error) {
      console.error("Error fetching boards:", error);
      setError("Failed to fetch boards. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
    fetchBoardsCount();
  }, [fetchBoards]);

  const fetchBoardsCount = async () => {
    try {
      const count = await boardServices.getBoardsCount();
      setTotalItems(count);
    } catch (error) {
      console.error("Error fetching boards count:", error);
    }
  };

  
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const toggleDetailsModal = () => {
    setIsDetailsModalOpen(!isDetailsModalOpen);
  };

  const handleViewDetails = (board) => {
    setSelectedBoard(board);
    setIsDetailsModalOpen(true);
  };

  const handleAddBoard = async (boardData) => {
    try {
      // Use the enhanced board services for complete structure
      const result = await enhancedBoardServices.addCompleteBoard(boardData);
      
      // Refresh the boards list and count
      await fetchBoards();
      await fetchBoardsCount();
      
      // Calculate totals for success message
      let totalClasses = 0;
      let totalSubjects = 0;
      let totalBooks = 0;
      let totalTopics = 0;
      
      Object.values(boardData.classes).forEach(classData => {
        totalClasses++;
        Object.values(classData.subjects).forEach(subjectData => {
          totalSubjects++;
          subjectData.books.forEach(book => {
            totalBooks++;
            totalTopics += book.topics.length;
          });
        });
      });
      
      // Show success message
      setSuccessMessage(
        `Board "${boardData.board}" added successfully! ` +
        `${totalClasses} classes, ${totalSubjects} subjects, ${totalBooks} books, ${totalTopics} topics.`
      );
      setTimeout(() => setSuccessMessage(null), 5000);
      
      return result;
    } catch (error) {
      console.error("Error adding board:", error);
      throw error;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleEditBoard = (board) => {
    setSelectedBoard(board);
    setIsEditModalOpen(true);
  };

  const handleUpdateBoard = async (boardId, boardData) => {
    try {
      // Use the enhanced board services for complete structure update
      const response = await enhancedBoardServices.updateCompleteBoard(boardId, boardData);
      
      // Refresh the boards list to show the updated board
      await fetchBoards();
      
      // Show success message
      setSuccessMessage("Board updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      return response;
    } catch (error) {
      console.error("Error updating board:", error);
      throw error;
    }
  };

  const handleDeleteBoard = (board) => {
    setBoardToDelete(board);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteBoard = async () => {
    if (boardToDelete) {
      try {
        await boardServices.deleteBoard(boardToDelete.id);
        console.log("Board deleted successfully");
        
        // Refresh the boards list
        await fetchBoards();
        
        // Show success message
        setSuccessMessage("Board deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
        
        // Close modal and reset state
        setIsDeleteModalOpen(false);
        setBoardToDelete(null);
      } catch (error) {
        console.error("Error deleting board:", error);
        setError("Failed to delete board. Please try again.");
      }
    }
  };

  const handleToggleBoardStatus = async(boardId,newStatus)=>{
    try {
      console.log(boardId,newStatus);
      const response = await boardServices.updateBoardStatus(boardId,newStatus);
      console.log(response);
      
      // Update the local state to reflect the change immediately
      setBoards(prevBoards => 
        prevBoards.map(board => 
          board.id === boardId 
            ? { ...board, isActive: newStatus }
            : board
        )
      );
    } catch (error) {
      console.error("Error updating board status:", error);
      setError("Failed to update board status. Please try again.");
    }
  }

  return (
    <>
      <style>
        {`
          .class-card {
            min-width: 200px;
            background: #f8f9fa;
            transition: all 0.3s ease;
            border: 1px solid #e9ecef !important;
          }
          .class-card:hover {
            background: #e9ecef;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .avatar-sm {
            width: 40px;
            height: 40px;
          }
          .table tbody tr:hover {
            background-color: rgba(0,0,0,0.02);
          }
          .table thead th {
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.875rem;
            letter-spacing: 0.5px;
          }
          .board-name {
            font-size: 1.1rem;
            font-weight: 600;
          }
          .status-badge {
            font-size: 0.875rem;
            padding: 0.5rem 1rem;
          }
        `}
      </style>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8"></div>
      {/* Page content */}
      <Container className="mt--7 mb-5" fluid>
        {/* Success Message */}
        {successMessage && (
          <Row className="mb-4">
            <div className="col">
              <Alert color="success" className="alert-dismissible fade show">
                <i className="fas fa-check-circle me-2"></i>
                {successMessage}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSuccessMessage(null)}
                ></button>
              </Alert>
            </div>
          </Row>
        )}

        {/* Summary Cards */}
        {boards.length > 0 && (
          <Row className="mb-4">
            <div className="col-xl-3 col-md-6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <div className="col">
                      <h5 className="card-title text-uppercase text-muted mb-0">Total Boards</h5>
                      <span className="h2 font-weight-bold mb-0">{boards.length}</span>
                    </div>
                    <div className="col-auto">
                      <div className="icon icon-shape bg-gradient-red text-white rounded-circle shadow">
                        <i className="fas fa-graduation-cap"></i>
                      </div>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </div>
            <div className="col-xl-3 col-md-6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <div className="col">
                      <h5 className="card-title text-uppercase text-muted mb-0">Total Classes</h5>
                      <span className="h2 font-weight-bold mb-0">
                        {boards.reduce((total, board) => {
                          return total + (board.classes ? Object.keys(board.classes).length : 0);
                        }, 0)}
                      </span>
                    </div>
                    <div className="col-auto">
                      <div className="icon icon-shape bg-gradient-orange text-white rounded-circle shadow">
                        <i className="fas fa-chalkboard-teacher"></i>
                      </div>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </div>
            <div className="col-xl-3 col-md-6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <div className="col">
                      <h5 className="card-title text-uppercase text-muted mb-0">Total Subjects</h5>
                      <span className="h2 font-weight-bold mb-0">
                        {boards.reduce((total, board) => {
                          if (!board.classes) return total;
                          return total + Object.values(board.classes).reduce((classTotal, classData) => {
                            return classTotal + (classData.subjects ? Object.keys(classData.subjects).length : 0);
                          }, 0);
                        }, 0)}
                      </span>
                    </div>
                    <div className="col-auto">
                      <div className="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                        <i className="fas fa-book"></i>
                      </div>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </div>
            <div className="col-xl-3 col-md-6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <div className="col">
                      <h5 className="card-title text-uppercase text-muted mb-0">Total Books</h5>
                      <span className="h2 font-weight-bold mb-0">
                        {boards.reduce((total, board) => {
                          if (!board.classes) return total;
                          return total + Object.values(board.classes).reduce((classTotal, classData) => {
                            if (!classData.subjects) return classTotal;
                            return classTotal + Object.values(classData.subjects).reduce((subjectTotal, subject) => {
                              return subjectTotal + (subject.books ? subject.books.length : 0);
                            }, 0);
                          }, 0);
                        }, 0)}
                      </span>
                    </div>
                    <div className="col-auto">
                      <div className="icon icon-shape bg-gradient-success text-white rounded-circle shadow">
                        <i className="fas fa-book-open"></i>
                      </div>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </div>
          </Row>
        )}

    

        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 bg-white">
                <div className="d-flex align-items-center justify-content-between">
                <div>
                    <h3 className="mb-0 text-dark">
                      <i className="fas fa-graduation-cap text-primary me-2"></i>
                      Educational Boards
                    </h3>
                    <p className="text-muted mb-0 mt-1">Manage boards, classes, subjects, books, and topics</p>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary" onClick={fetchBoards}>
                      <i className="fas fa-sync-alt me-1"></i>
                      Refresh
                    </button>
                  <button className="btn btn-primary" onClick={toggleModal}>
                      <i className="fas fa-plus me-1"></i>
                    Add Board
                  </button>
                  </div>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col" className="border-0">
                      <i className="fas fa-graduation-cap me-2"></i>
                      Board Name
                    </th>
                    <th scope="col" className="border-0">
                      <i className="fas fa-chalkboard-teacher me-2"></i>
                      Classes & Content
                    </th>
                    <th scope="col" className="border-0">
                      <i className="fas fa-toggle-on me-2"></i>
                      Status
                    </th>
                    <th scope="col" className="border-0">
                      <i className="fas fa-cogs me-2"></i>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <div className="d-flex flex-column align-items-center">
                          <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
                            <span className="sr-only">Loading...</span>
                          </div>
                          <h5 className="text-muted">Loading boards...</h5>
                          <p className="text-muted mb-0">Please wait while we fetch your data</p>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <div className="alert alert-danger border-0 shadow-sm">
                          <div className="d-flex align-items-center justify-content-center">
                            <i className="fas fa-exclamation-triangle fa-2x me-3"></i>
                            <div>
                              <h5 className="mb-1">Error Loading Boards</h5>
                              <p className="mb-2">{error}</p>
                              <button 
                                className="btn btn-outline-danger" 
                                onClick={fetchBoards}
                              >
                                <i className="fas fa-redo me-1"></i>
                                Try Again
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : boards.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <div className="text-muted">
                          <div className="mb-4">
                            <i className="fas fa-graduation-cap fa-4x text-muted"></i>
                          </div>
                          <h4 className="mb-2">No Boards Found</h4>
                          <p className="mb-3">Get started by adding your first educational board</p>
                          <button className="btn btn-primary" onClick={toggleModal}>
                            <i className="fas fa-plus me-1"></i>
                            Add Your First Board
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    boards.map((board) => (
                    <tr key={board.id} className="border-bottom">
                      <td className="border-0">
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                            <i className="fas fa-graduation-cap text-white"></i>
                          </div>
                          <div>
                            <h6 className="mb-0 fw-bold text-dark">{board.name}</h6>
                            <small className="text-muted">ID: {board.id}</small>
                          </div>
                        </div>
                      </td>
                      <td className="border-0">
                        {board.classes ? (
                          <div className="d-flex flex-wrap gap-2">
                            {Object.keys(board.classes).map((classKey) => {
                              const classData = board.classes[classKey];
                              const subjectCount = classData?.subjects ? Object.keys(classData.subjects).length : 0;
                              let totalBooks = 0;
                              let totalTopics = 0;
                              
                              if (classData?.subjects) {
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
                              
                              return (
                                <div key={classKey} className="class-card p-3 border rounded">
                                  <div className="d-flex align-items-center mb-2">
                                    <Badge color="primary" className="me-2">
                                      <i className="fas fa-chalkboard-teacher me-1"></i>
                                      Class {classKey}
                          </Badge>
                                  </div>
                                  <div className="row g-2">
                                    <div className="col-4">
                                      <div className="text-center">
                                        <div className="fw-bold text-info">{subjectCount}</div>
                                        <small className="text-muted">Subjects</small>
                                      </div>
                                    </div>
                                    <div className="col-4">
                                      <div className="text-center">
                                        <div className="fw-bold text-success">{totalBooks}</div>
                                        <small className="text-muted">Books</small>
                                      </div>
                                    </div>
                                    <div className="col-4">
                                      <div className="text-center">
                                        <div className="fw-bold text-warning">{totalTopics}</div>
                                        <small className="text-muted">Topics</small>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center text-muted py-3">
                            <i className="fas fa-exclamation-triangle fa-2x mb-2"></i>
                            <div>No class data available</div>
                            <small>Board ID: {board.id}</small>
                          </div>
                        )}
                      </td>
                      <td className="border-0">
                        <div className="d-flex align-items-center">
                          <Switch
                            onChange={() => handleToggleBoardStatus(board.id, !board.isActive)}
                            checked={board.isActive}
                            onColor="#28a745"
                            offColor="#dc3545"
                            uncheckedIcon={false}
                            checkedIcon={false}
                            height={24}
                            width={50}
                            handleDiameter={20}
                          />
                          <div className="ms-3">
                            <Badge 
                              color={board.isActive ? "success" : "danger"}
                              className="px-3 py-2"
                            >
                              <i className={`fas fa-${board.isActive ? 'check-circle' : 'times-circle'} me-1`}></i>
                            {board.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="border-0">
                        <div className="d-flex gap-2">
                          <Button 
                            color="info" 
                          size="sm"
                            onClick={() => handleViewDetails(board)}
                            title="View Details"
                            className="px-3"
                          >
                            <i className="fas fa-eye me-1"></i>
                            View
                          </Button>
                          <Button 
                            color="primary" 
                          size="sm"
                            onClick={() => handleEditBoard(board)}
                            title="Edit Board"
                            className="px-3"
                          >
                            <i className="fas fa-edit me-1"></i>
                            Edit
                          </Button>
                          <Button 
                            color="danger" 
                          size="sm"
                            onClick={() => handleDeleteBoard(board)}
                            title="Delete Board"
                            className="px-3"
                          >
                            <i className="fas fa-trash me-1"></i>
                            Delete
                          </Button>
                      </div>
                    </td>
                  </tr>
                    ))
                  )}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <AccessiblePagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalItems / itemsPerPage)}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  loading={loading}
                  showItemsPerPage={true}
                  showPageInfo={true}
                  showFirstLast={true}
                  maxVisiblePages={5}
                />
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>

        <EnhancedAddBoardsModal
          isOpen={isModalOpen}
          toggle={toggleModal}
          onAddBoard={handleAddBoard}
        />
      
      <EnhancedEditBoardsModal 
        isOpen={isEditModalOpen} 
        toggle={toggleEditModal} 
        onUpdateBoard={handleUpdateBoard}
        boardData={selectedBoard}
      />
      
      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen} 
        toggle={toggleDeleteModal} 
        onConfirm={confirmDeleteBoard}
        boardName={boardToDelete?.board}
      />
      
      <BoardDetailsModal
        isOpen={isDetailsModalOpen}
        toggle={toggleDetailsModal}
        boardData={selectedBoard}
      />
    </>
  );
};

export default BoardsClasses;
