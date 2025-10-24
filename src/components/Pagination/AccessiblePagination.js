import React from 'react';
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  ButtonGroup
} from 'reactstrap';

const AccessiblePagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  showPageInfo = true,
  showFirstLast = true,
  maxVisiblePages = 5,
  loading = false,
  className = ""
}) => {
  // Calculate visible page range
  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);
    
    // Adjust if we're near the beginning or end
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageClick = (page) => {
    if (page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    if (newItemsPerPage !== itemsPerPage && !loading) {
      onItemsPerPageChange(newItemsPerPage);
    }
  };

  const handleFirstPage = () => {
    if (currentPage > 1 && !loading) {
      onPageChange(1);
    }
  };

  const handleLastPage = () => {
    if (currentPage < totalPages && !loading) {
      onPageChange(totalPages);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1 && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  // Don't render if there's only one page and no items per page selector
  if (totalPages <= 1 && !showItemsPerPage) {
    return null;
  }

  return (
    <div className={`pagination-wrapper ${className}`}>
      <Row className="align-items-center">
        {/* Page Info */}
        {showPageInfo && (
          <Col md="6" className="mb-3 mb-md-0">
            <div className="pagination-info">
              <span className="text-muted">
                Showing {startItem} to {endItem} of {totalItems} entries
              </span>
            </div>
          </Col>
        )}

        {/* Items Per Page Selector */}
        {showItemsPerPage && (
          <Col md="3" className="mb-3 mb-md-0">
            <div className="d-flex align-items-center">
              <Label for="itemsPerPage" className="me-2 mb-0 small">
                Show:
              </Label>
              <Input
                type="select"
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                disabled={loading}
                bsSize="sm"
                style={{ width: '80px' }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Input>
              <span className="ms-2 small text-muted">per page</span>
            </div>
          </Col>
        )}

        {/* Pagination Controls */}
        <Col md={showItemsPerPage ? "3" : "6"} className="text-md-end">
          <nav aria-label="Pagination Navigation">
            <Pagination
              className="pagination justify-content-center justify-content-md-end mb-0"
              listClassName="mb-0"
            >
              {/* First Page */}
              {showFirstLast && (
                <PaginationItem disabled={currentPage === 1 || loading}>
                  <PaginationLink
                    first
                    onClick={handleFirstPage}
                    disabled={currentPage === 1 || loading}
                    aria-label="Go to first page"
                    tabIndex={currentPage === 1 ? -1 : 0}
                  >
                    <i className="fas fa-angle-double-left" />
                    <span className="sr-only">First page</span>
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Previous Page */}
              <PaginationItem disabled={currentPage === 1 || loading}>
                <PaginationLink
                  previous
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1 || loading}
                  aria-label="Go to previous page"
                  tabIndex={currentPage === 1 ? -1 : 0}
                >
                  <i className="fas fa-angle-left" />
                  <span className="sr-only">Previous page</span>
                </PaginationLink>
              </PaginationItem>

              {/* Page Numbers */}
              {visiblePages.map((page) => (
                <PaginationItem key={page} active={page === currentPage}>
                  <PaginationLink
                    onClick={() => handlePageClick(page)}
                    disabled={loading}
                    aria-label={`Go to page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* Next Page */}
              <PaginationItem disabled={currentPage === totalPages || loading}>
                <PaginationLink
                  next
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || loading}
                  aria-label="Go to next page"
                  tabIndex={currentPage === totalPages ? -1 : 0}
                >
                  <i className="fas fa-angle-right" />
                  <span className="sr-only">Next page</span>
                </PaginationLink>
              </PaginationItem>

              {/* Last Page */}
              {showFirstLast && (
                <PaginationItem disabled={currentPage === totalPages || loading}>
                  <PaginationLink
                    last
                    onClick={handleLastPage}
                    disabled={currentPage === totalPages || loading}
                    aria-label="Go to last page"
                    tabIndex={currentPage === totalPages ? -1 : 0}
                  >
                    <i className="fas fa-angle-double-right" />
                    <span className="sr-only">Last page</span>
                  </PaginationLink>
                </PaginationItem>
              )}
            </Pagination>
          </nav>
        </Col>
      </Row>

      {/* Loading Indicator */}
      {loading && (
        <Row>
          <Col className="text-center mt-2">
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <span className="text-muted small">Loading...</span>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AccessiblePagination;
