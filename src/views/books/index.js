import React from "react";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
} from "reactstrap";

const Books = () => {
  // Dummy books data
  const books = [
    {
      name: "Mathematics Grade 10",
      board: "CBSE",
      class: "10",
      bookId: "CBSE-MATH-10-01",
      isActive: true,
    },
    {
      name: "Science Essentials 8",
      board: "ICSE",
      class: "8",
      bookId: "ICSE-SCI-8-05",
      isActive: true,
    },
    {
      name: "English Grammar Workbook",
      board: "CBSE",
      class: "6",
      bookId: "CBSE-ENG-6-12",
      isActive: false,
    },
    {
      name: "Social Studies - History & Civics",
      board: "ICSE",
      class: "9",
      bookId: "ICSE-SS-9-03",
      isActive: true,
    },
    {
      name: "Computer Applications",
      board: "State Board",
      class: "7",
      bookId: "STB-COMP-7-07",
      isActive: false,
    },
  ];

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8"></div>
      {/* Page content */}
      <Container className="mt--7 mb-5" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex align-items-center justify-content-between">
                <h3 className="mb-0">Books</h3>
                <button className="btn btn-primary">Add Book</button>
              </CardHeader>

              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Board</th>
                    <th scope="col">Class</th>
                    <th scope="col">Book ID</th>
                    <th scope="col">Is Active</th>
                    <th scope="col" className="text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book, index) => (
                    <tr key={index}>
                      <th scope="row">{book.name}</th>
                      <td>{book.board}</td>
                      <td>{book.class}</td>
                      <td>{book.bookId}</td>
                      <td>
                        {book.isActive ? (
                          <Badge color="success" pill>
                            Active
                          </Badge>
                        ) : (
                          <Badge color="danger" pill>
                            Inactive
                          </Badge>
                        )}
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
                            <DropdownItem>Edit</DropdownItem>
                            <DropdownItem>View</DropdownItem>
                            <DropdownItem>Delete</DropdownItem>
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
                        2
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
    </>
  );
};

export default Books;
