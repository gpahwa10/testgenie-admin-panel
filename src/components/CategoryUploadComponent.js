import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Alert,
  Spinner,
  Row,
  Col,
  Progress,
  Table
} from 'reactstrap';
import { uploadCompleteCategoryData, getCategoryDataStats } from 'api/uploadCategoryData';

const CategoryUploadComponent = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Get stats when component mounts
    const categoryStats = getCategoryDataStats();
    setStats(categoryStats);
  }, []);

  const handleUpload = async () => {
    try {
      setUploading(true);
      setError(null);
      setUploadResult(null);

      console.log('🚀 Starting complete category data upload...');
      const result = await uploadCompleteCategoryData();
      
      setUploadResult(result);
      console.log('✅ Upload completed:', result);
      
    } catch (err) {
      console.error('❌ Upload failed:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="shadow">
      <CardHeader className="bg-gradient-primary text-white">
        <h3 className="mb-0">
          <i className="fas fa-database me-2"></i>
          Complete Category Data Upload
        </h3>
      </CardHeader>
      <CardBody>
        {error && (
          <Alert color="danger" className="mb-4">
            <i className="fas fa-exclamation-triangle me-2"></i>
            <strong>Upload Failed:</strong> {error}
          </Alert>
        )}

        {uploadResult && (
          <Alert color="success" className="mb-4">
            <i className="fas fa-check-circle me-2"></i>
            <strong>Upload Successful!</strong>
            <div className="mt-2">
              <Row>
                <Col md="3">
                  <strong>Boards:</strong> {uploadResult.summary.totalBoards}
                </Col>
                <Col md="3">
                  <strong>Classes:</strong> {uploadResult.summary.totalClasses}
                </Col>
                <Col md="3">
                  <strong>Subjects:</strong> {uploadResult.summary.totalSubjects}
                </Col>
                <Col md="3">
                  <strong>Books:</strong> {uploadResult.summary.totalBooks}
                </Col>
              </Row>
            </div>
          </Alert>
        )}

        {stats && (
          <div className="mb-4">
            <h5 className="mb-3">📊 Data Overview (from category.json)</h5>
            <Row className="text-center mb-4">
              <Col md="3">
                <div className="border rounded p-3 bg-light">
                  <i className="fas fa-school fa-2x text-primary mb-2"></i>
                  <div><strong>{stats.totalBoards} Boards</strong></div>
                  <small className="text-muted">CBSE, ICSE, NIOS, etc.</small>
                </div>
              </Col>
              <Col md="3">
                <div className="border rounded p-3 bg-light">
                  <i className="fas fa-graduation-cap fa-2x text-info mb-2"></i>
                  <div><strong>{stats.totalClasses} Classes</strong></div>
                  <small className="text-muted">Across all boards</small>
                </div>
              </Col>
              <Col md="3">
                <div className="border rounded p-3 bg-light">
                  <i className="fas fa-book fa-2x text-warning mb-2"></i>
                  <div><strong>{stats.totalSubjects} Subjects</strong></div>
                  <small className="text-muted">English, Maths, Science, etc.</small>
                </div>
              </Col>
              <Col md="3">
                <div className="border rounded p-3 bg-light">
                  <i className="fas fa-book-open fa-2x text-success mb-2"></i>
                  <div><strong>{stats.totalBooks} Books</strong></div>
                  <small className="text-muted">NCERT & Other Publishers</small>
                </div>
              </Col>
            </Row>

            <h6 className="mb-3">📋 Board Breakdown:</h6>
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Board</th>
                  <th>Classes</th>
                  <th>Subjects</th>
                  <th>Books</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.boards).map(([boardName, boardStats]) => (
                  <tr key={boardName}>
                    <td><strong>{boardName}</strong></td>
                    <td>{boardStats.classes}</td>
                    <td>{boardStats.subjects}</td>
                    <td>{boardStats.books}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        <div className="text-center">
          <h5 className="mb-3">🚀 Upload Complete Category Data</h5>
          <p className="text-muted mb-4">
            This will upload the entire <code>category.json</code> file to Firestore, creating all boards, classes, subjects, and books with proper relationships.
          </p>
          
          <Alert color="warning" className="mb-4">
            <i className="fas fa-exclamation-triangle me-2"></i>
            <strong>Warning:</strong> This will create a large number of documents in Firestore. 
            Make sure you have sufficient Firestore quota and this is what you intend to do.
          </Alert>

          <Button
            color="primary"
            size="lg"
            onClick={handleUpload}
            disabled={uploading}
            className="px-5"
          >
            {uploading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Uploading Complete Data...
              </>
            ) : (
              <>
                <i className="fas fa-upload me-2"></i>
                Upload Complete Category Data
              </>
            )}
          </Button>

          {uploading && (
            <div className="mt-3">
              <Alert color="info">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Uploading...</strong> Please wait while we process all the data from category.json.
                This may take several minutes depending on the amount of data.
              </Alert>
              <Progress value={100} animated color="primary" className="mt-2">
                Processing...
              </Progress>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default CategoryUploadComponent;
