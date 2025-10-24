import React, { useEffect, useState } from "react";
import {
  Media,
  Badge,
  Card,
  CardHeader,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Button,
  ButtonGroup,
  Alert,
} from "reactstrap";
import Switch from "react-switch";
import AddBoardsModal from "components/modals/AddBoardsModal";
import EditBoardsModal from "components/modals/EditBoardsModal";
import ConfirmDeleteModal from "components/modals/ConfirmDeleteModal";
import { boardServices } from "services/boardServices";
const BoardsClasses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [boardToDelete, setBoardToDelete] = useState(null);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await boardServices.fetchBoards();
      setBoards(data.boards);
    } catch (error) {
      console.error("Error fetching boards:", error);
      setError("Failed to fetch boards. Please try again.");
    } finally {
      setLoading(false);
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

  const handleAddBoard = async (boardData) => {
    try {
      const response = await boardServices.addBoard(boardData);
      console.log("Board added successfully:", response);
      
      // Refresh the boards list to show the new board
      await fetchBoards();
      
      // Show success message
      setSuccessMessage("Board added successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      return response;
    } catch (error) {
      console.error("Error adding board:", error);
      throw error;
    }
  };

  const handleEditBoard = (board) => {
    setSelectedBoard(board);
    setIsEditModalOpen(true);
  };

  const handleUpdateBoard = async (boardId, boardData) => {
    try {
      const response = await boardServices.updateBoard(boardId, boardData);
      console.log("Board updated successfully:", response);
      
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
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex align-items-center justify-content-between">
                <h3 className="mb-0">Boards And Classes</h3>
                <div>
                  <button className="btn btn-primary" onClick={toggleModal}>
                    Add Board
                  </button>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Board</th>
                    <th scope="col">Classes</th>
                    <th scope="col">Is Board Active</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        <div className="d-flex justify-content-center align-items-center">
                          <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                          <span className="ml-2">Loading boards...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        <div className="alert alert-danger mb-0">
                          {error}
                          <button 
                            className="btn btn-sm btn-outline-danger ml-2" 
                            onClick={fetchBoards}
                          >
                            Retry
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : boards.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        <div className="text-muted">
                          <i className="fas fa-inbox fa-2x mb-2"></i>
                          <p className="mb-0">No boards found. Add your first board to get started.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    boards.map((board) => (
                    <tr key={board.id}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <Media>
                            <span className="mb-0 text-sm">{board.board}</span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                        {Object.keys(board.classes).map((classKey) => {
                          const subjectCount = board.classes[classKey]?.subject?.length || 0;
                          return (
                          <Badge key={classKey} color="primary" className="mr-1 mb-1">
                              {`Class ${classKey} (${subjectCount} subjects)`}
                          </Badge>
                          );
                        })}
                      </td>
                    
                      <td>
                        <div className="d-flex align-items-center">
                          <Switch
                            onChange={() => handleToggleBoardStatus(board.id, !board.isActive)}
                            checked={board.isActive}
                            onColor="#4caf50"
                            offColor="#ccc"
                            uncheckedIcon={false}
                            checkedIcon={false}
                            height={22}
                            width={45}
                            handleDiameter={18}
                          />
                          <span
                            className={`ms-2 fw-bold mx-2 ${
                              board.isActive ? "text-success" : "text-danger"
                            }`}
                          >
                            {board.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <ButtonGroup size="sm">
                          <Button 
                            color="primary" 
                            onClick={() => handleEditBoard(board)}
                            title="Edit Board"
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button 
                            color="danger" 
                            onClick={() => handleDeleteBoard(board)}
                            title="Delete Board"
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </ButtonGroup>
                    </td>
                  </tr>
                    ))
                  )}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>

      <AddBoardsModal 
        isOpen={isModalOpen} 
        toggle={toggleModal} 
        onAddBoard={handleAddBoard}
      />
      
      <EditBoardsModal 
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
    </>
  );
};

export default BoardsClasses;
