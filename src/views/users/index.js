import React, { useState } from 'react'
import { Media, Badge, Card, CardHeader, CardFooter, DropdownMenu, DropdownItem, UncontrolledDropdown, DropdownToggle, Pagination, PaginationItem, PaginationLink, Table, Container, Row, Button } from 'reactstrap'
import AddUserModal from 'components/modals/AddUserModal'

const Users = () => {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phoneNumber: '+1 (555) 123-4567',
      schoolName: 'Harvard University',
      credits: 150,
      uid: 'USR001',
      avatar: require("../../assets/img/theme/team-1-800x800.jpg")
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phoneNumber: '+1 (555) 234-5678',
      schoolName: 'Stanford University',
      credits: 75,
      uid: 'USR002',
      avatar: require("../../assets/img/theme/team-2-800x800.jpg")
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      phoneNumber: '+1 (555) 345-6789',
      schoolName: 'MIT',
      credits: 200,
      uid: 'USR003',
      avatar: require("../../assets/img/theme/team-3-800x800.jpg")
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phoneNumber: '+1 (555) 456-7890',
      schoolName: 'Yale University',
      credits: 25,
      uid: 'USR004',
      avatar: require("../../assets/img/theme/team-4-800x800.jpg")
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phoneNumber: '+1 (555) 567-8901',
      schoolName: 'Princeton University',
      credits: 300,
      uid: 'USR005',
      avatar: require("../../assets/img/theme/team-1-800x800.jpg")
    }
  ]);

  const toggleAddUserModal = () => {
    setIsAddUserModalOpen(!isAddUserModalOpen);
  };

  const handleAddUser = (newUserData) => {
    const newUser = {
      id: users.length + 1,
      ...newUserData,
      avatar: require("../../assets/img/theme/team-1-800x800.jpg") // Default avatar
    };
    
    setUsers(prevUsers => [...prevUsers, newUser]);
    
    // Here you would typically make an API call to save the user
    console.log('New user added:', newUser);
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
      {/* Table */}
      <Row>
        <div className="col">
          <Card className="shadow">
                <CardHeader className="border-0 d-flex align-items-center justify-content-between">
                <h3 className="mb-0">Users</h3>
                <Button color="primary" onClick={toggleAddUserModal}>
                  Add User
                </Button>
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
                  {/* <th scope="col" /> */}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
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
                            src={user.avatar}
                        />
                      </a>
                      <Media>
                        <span className="mb-0 text-sm">
                            {user.name}
                        </span>
                      </Media>
                    </Media>
                  </th>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.schoolName}</td>
                    <td>
                      <Badge color={getCreditsBadgeColor(user.credits)} className="badge-dot mr-4">
                        <i className={`bg-${getCreditsBadgeColor(user.credits)}`} />
                        {user.credits} Credits
                    </Badge>
                  </td>
                    <td>{user.uid}</td>
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
                          onClick={(e) => e.preventDefault()}
                        >
                          Edit User
                        </DropdownItem>
                        <DropdownItem
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          View Profile
                        </DropdownItem>
                        <DropdownItem
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          Delete User
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </td>
                </tr>
                ))}
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
    
    {/* Add User Modal */}
    <AddUserModal 
      isOpen={isAddUserModalOpen}
      toggle={toggleAddUserModal}
      onAddUser={handleAddUser}
    />
  </>
  )
}

export default Users