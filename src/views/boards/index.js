import React, {useState} from 'react'
import { Media, UncontrolledTooltip, Badge, Card, CardHeader, CardFooter, DropdownMenu, DropdownItem, UncontrolledDropdown, DropdownToggle, Pagination, PaginationItem, PaginationLink, Progress, Table, Container, Row } from 'reactstrap'
import Header from 'components/Headers/Header'
import AddBoardsModal from 'components/modals/AddBoardsModal'
const BoardsClasses = () => {
  const [isModalOpen,setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  }


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
                  <h3 className="mb-0">Boards And Classes</h3>
                  <div>
                  <button className="btn btn-primary" onClick={toggleModal}>Add Board</button>
                  </div>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Board</th>
                      <th scope="col">Classes</th>
                      <th scope="col">Is Board Active</th>
                      {/* <th scope="col" /> */}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">
                        <Media className="align-items-center">
                          <Media>
                            <span className="mb-0 text-sm">
                              CBSE (Central Board of Secondary Education)
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                        <div className="d-flex flex-wrap">
                          <Badge color="primary" className="mr-1 mb-1">Class 1</Badge>
                          <Badge color="primary" className="mr-1 mb-1">Class 2</Badge>
                          <Badge color="primary" className="mr-1 mb-1">Class 3</Badge>
                          <Badge color="primary" className="mr-1 mb-1">Class 4</Badge>
                        </div>
                      </td>
                      <td>
                        <Badge color="success" className="badge-dot mr-4">
                          <i className="bg-success" />
                          Active
                        </Badge>
                      </td>
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
                              Edit Board
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Manage Classes
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Deactivate Board
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <Media className="align-items-center">
                          <Media>
                            <span className="mb-0 text-sm">
                              ICSE (Indian Certificate of Secondary Education)
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                        <div className="d-flex flex-wrap">
                        <Badge color="primary" className="mr-1 mb-1">Class 1</Badge>
                          <Badge color="primary" className="mr-1 mb-1">Class 2</Badge>
                          <Badge color="primary" className="mr-1 mb-1">Class 3</Badge>
                          <Badge color="primary" className="mr-1 mb-1">Class 4</Badge>
                        </div>
                      </td>
                      <td>
                        <Badge color="success" className="badge-dot mr-4">
                          <i className="bg-success" />
                          Active
                        </Badge>
                      </td>
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
                              Edit Board
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Manage Classes
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Deactivate Board
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <Media className="align-items-center">
                          <Media>
                            <span className="mb-0 text-sm">
                              Maharashtra State Board
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                        <div className="d-flex flex-wrap">
                        <Badge color="primary" className="mr-1 mb-1">Class 1</Badge>
                          <Badge color="primary" className="mr-1 mb-1">Class 2</Badge>
                          <Badge color="primary" className="mr-1 mb-1">Class 3</Badge>
                          <Badge color="primary" className="mr-1 mb-1">Class 4</Badge>
                        </div>
                      </td>
                      <td>
                        <Badge color="success" className="badge-dot mr-4">
                          <i className="bg-success" />
                          Active
                        </Badge>
                      </td>
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
                              Edit Board
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Manage Classes
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Deactivate Board
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <Media className="align-items-center">
                          <Media>
                            <span className="mb-0 text-sm">
                              Karnataka State Board
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                        <div className="d-flex flex-wrap">
                        <Badge color="primary" className="mr-1 mb-1">Class 1</Badge>
                          <Badge color="primary" className="mr-1 mb-1">Class 2</Badge>
                          <Badge color="primary" className="mr-1 mb-1">Class 3</Badge>
                          <Badge color="primary" className="mr-1 mb-1">Class 4</Badge>
                        </div>
                      </td>
                      <td>
                        <Badge color="success" className="badge-dot mr-4">
                          <i className="bg-success" />
                          Active
                        </Badge>
                      </td>
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
                              Edit Board
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Manage Classes
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Deactivate Board
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <Media className="align-items-center">
                          <Media>
                            <span className="mb-0 text-sm">
                              Tamil Nadu State Board
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                        <div className="d-flex flex-wrap">
                        <Badge color="primary" className="mr-1 mb-1">Class 1</Badge>
                          <Badge color="primary" className="mr-1 mb-1">Class 2</Badge>
                          <Badge color="primary" className="mr-1 mb-1">Class 3</Badge>
                          <Badge color="primary" className="mr-1 mb-1">Class 4</Badge>
                        </div>
                      </td>
                      <td>
                        <Badge color="success" className="badge-dot mr-4">
                          <i className="bg-success" />
                          Active
                        </Badge>
                      </td>
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
                              Edit Board
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Manage Classes
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Deactivate Board
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
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

<AddBoardsModal isOpen={isModalOpen} toggle={toggleModal} />

      </>
      )
}

export default BoardsClasses