import React, { useState, useEffect } from 'react'
import { Media, Badge, Card, CardHeader, CardFooter, DropdownMenu, DropdownItem, UncontrolledDropdown, DropdownToggle,  Table, Container, Row, Button, Spinner, Alert } from 'reactstrap'
import AddUserModal from 'components/modals/AddUserModal'
import EditUserModal from 'components/modals/EditUserModal'
import ConfirmDeleteUserModal from 'components/modals/ConfirmDeleteUserModal'
import AccessiblePagination from 'components/Pagination/AccessiblePagination'
import { usersService } from '../../services/usersService'
import { useNavigate } from 'react-router-dom'; 
const Users = () => {
  const navigate = useNavigate();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [lastVisible, setLastVisible] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
    fetchUsersCount();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Calculate the last visible document for the current page
      let lastDoc = null;
      if (currentPage > 1) {
        // For simplicity, we'll fetch all previous pages
        // In a real app, you'd want to store the lastVisible for each page
        const previousData = await usersService.fetchUsers((currentPage - 1) * itemsPerPage);
        lastDoc = previousData.lastVisible;
      }
      
      const data = await usersService.fetchUsers(itemsPerPage, lastDoc);
      setUsers(data.users);
      setLastVisible(data.lastVisible);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersCount = async () => {
    try {
      // For now, we'll estimate based on the first fetch
      // In a real app, you'd want a separate count query
      const data = await usersService.fetchUsers(1);
      // This is a simplified approach - you'd want a proper count query
      setTotalItems(data.users.length > 0 ? 100 : 0); // Placeholder
    } catch (err) {
      console.error('Error fetching users count:', err);
    }
  };

  const refreshUsers = () => {
    fetchUsers();
    fetchUsersCount();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const toggleAddUserModal = () => {
    setIsAddUserModalOpen(!isAddUserModalOpen);
  };

  const toggleEditUserModal = () => {
    setIsEditUserModalOpen(!isEditUserModalOpen);
  };

  const toggleDeleteUserModal = () => {
    setIsDeleteUserModalOpen(!isDeleteUserModalOpen);
  };

  const handleAddUser = async (newUserData) => {
    try {
      const newUser = await usersService.addUser(newUserData);
      setUsers(prevUsers => [newUser, ...prevUsers]);
      setIsAddUserModalOpen(false); // Close modal after successful add
      
      // Show success message
      setSuccessMessage("User added successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      console.log('New user added:', newUser);
    } catch (err) {
      console.error('Error adding user:', err);
      setError('Failed to add user. Please try again.');
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      const updatedUser = await usersService.updateUser(userId, userData);
      
      // Update the user in the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, ...userData } : user
        )
      );
      
      // Close modal
      setIsEditUserModalOpen(false);
      
      // Show success message
      setSuccessMessage("User updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      console.log('User updated:', updatedUser);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
    }
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteUserModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        await usersService.deleteUser(userToDelete.id);
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
        
        // Show success message
        setSuccessMessage("User deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
        
        // Close modal and reset state
        setIsDeleteUserModalOpen(false);
        setUserToDelete(null);
        
        console.log('User deleted successfully');
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const user = await usersService.getUserById(userId);
      console.log('User:', user);
      navigate(`/admin/users/${userId}`);
    } catch (err) {
      console.error('Error getting user:', err);
      setError('Failed to get user. Please try again.');
    }
  };

  const getCreditsBadgeColor = (credits) => {
    if (credits >= 200) return 'success';
    if (credits >= 100) return 'info';
    if (credits >= 50) return 'warning';
    return 'danger';
  };
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
      
      {/* Error Alert */}
      {error && (
        <Row>
          <div className="col">
            <Alert color="danger" className="mb-4">
              {error}
            </Alert>
          </div>
        </Row>
      )}
      
      {/* Table */}
      <Row>
        <div className="col">
          <Card className="shadow">
                <CardHeader className="border-0 d-flex align-items-center justify-content-between">
                <h3 className="mb-0">Users</h3>
                <div className="d-flex gap-2">
                  <Button color="secondary" onClick={refreshUsers} disabled={loading}>
                    {loading ? <Spinner size="sm" /> : 'Refresh'}
                  </Button>
                  <Button color="primary" onClick={toggleAddUserModal}>
                    Add User
                  </Button>
                </div>
                </CardHeader>
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">School Name</th>
                  <th scope="col">Credits</th>
                  <th scope="col">UID</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <Spinner color="primary" />
                      <span className="ml-2">Loading users...</span>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                    <th scope="row">
                      <Media className="align-items-center">
                        <a
                          className="avatar rounded-circle mr-3"
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt="..."
                            src={user.image || require("../../assets/img/theme/team-1-800x800.jpg")}
                          />
                        </a>
                        <Media>
                          <span className="mb-0 text-sm">
                              {user.name || user.displayName || 'N/A'}
                          </span>
                        </Media>
                      </Media>
                    </th>
                      <td>{user.email || 'N/A'}</td>
                      <td>{user.phoneNumber || user.phone || 'N/A'}</td>
                      <td>{user.schoolName || user.school || 'N/A'}</td>
                      <td>
                        <Badge color={getCreditsBadgeColor(user.credit || 0)} className="badge-dot mr-4">
                          <i className={`bg-${getCreditsBadgeColor(user.credit || 0)}`} />
                          {user.credit || 0} Credits
                      </Badge>
                    </td>
                      <td>{user.uid || user.id}</td>
                  <td className="text-right">
                    <UncontrolledDropdown>
                      <DropdownToggle
                        className="btn-icon-only text-light"
                        href="#pablo"
                        role="button"
                        size="sm"
                        color=""
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-ellipsis-v" />
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-arrow" right>
                        <DropdownItem
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            handleEditUser(user);
                          }}
                        >
                          Edit User
                        </DropdownItem>
                        <DropdownItem
                          href="#pablo"
                          onClick={(e) => {e.preventDefault();
                            handleViewUser(user.id);
                          }}
                        >
                          View Profile
                        </DropdownItem>
                        <DropdownItem
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteUser(user);
                          }}
                        >
                          Delete User
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </td>
                  </tr>
                 )))}
                </tbody>
            </Table>
            {/* <CardFooter className="py-4">
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
            </CardFooter> */}
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
    
    {/* Add User Modal */}
    <AddUserModal 
      isOpen={isAddUserModalOpen}
      toggle={toggleAddUserModal}
      onAddUser={handleAddUser}
    />
    
    {/* Edit User Modal */}
    <EditUserModal 
      isOpen={isEditUserModalOpen}
      toggle={toggleEditUserModal}
      onUpdateUser={handleUpdateUser}
      userData={selectedUser}
    />
    
    {/* Confirm Delete User Modal */}
    <ConfirmDeleteUserModal 
      isOpen={isDeleteUserModalOpen}
      toggle={toggleDeleteUserModal}
      onConfirm={confirmDeleteUser}
      userName={userToDelete?.name || userToDelete?.displayName}
      userEmail={userToDelete?.email}
    />
  </>
  )
}

export default Users