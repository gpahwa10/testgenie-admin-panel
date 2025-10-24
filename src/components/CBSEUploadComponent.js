import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Alert,
  Spinner,
  Row,
  Col
} from 'reactstrap';
import { uploadCompleteCBSEBoard } from 'api/uploadCBSEBoard';

const CBSEUploadComponent = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    try {
      setUploading(true);
      setError(null);
      setUploadResult(null);

      console.log('🚀 Starting CBSE board upload...');
      const result = await uploadCompleteCBSEBoard();
      
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
          <i className="fas fa-upload me-2"></i>
          CBSE Board Data Upload
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
                  <strong>Board:</strong> {uploadResult.boardId}
                </Col>
                <Col md="3">
                  <strong>Classes:</strong> {uploadResult.totalClasses}
                </Col>
                <Col md="3">
                  <strong>Subjects:</strong> {uploadResult.totalSubjects}
                </Col>
                <Col md="3">
                  <strong>Books:</strong> {uploadResult.totalBooks}
                </Col>
              </Row>
            </div>
          </Alert>
        )}

        <div className="text-center">
          <h5 className="mb-3">Upload Complete CBSE Board Structure</h5>
          <p className="text-muted mb-4">
            This will create the complete CBSE board structure with all classes, subjects, and books in Firestore.
          </p>
          
          <div className="mb-4">
            <h6>What will be created:</h6>
            <Row className="text-center">
              <Col md="3">
                <div className="border rounded p-3">
                  <i className="fas fa-school fa-2x text-primary mb-2"></i>
                  <div><strong>1 Board</strong></div>
                  <small className="text-muted">CBSE</small>
                </div>
              </Col>
              <Col md="3">
                <div className="border rounded p-3">
                  <i className="fas fa-graduation-cap fa-2x text-info mb-2"></i>
                  <div><strong>6 Classes</strong></div>
                  <small className="text-muted">Class 1-6</small>
                </div>
              </Col>
              <Col md="3">
                <div className="border rounded p-3">
                  <i className="fas fa-book fa-2x text-warning mb-2"></i>
                  <div><strong>~35 Subjects</strong></div>
                  <small className="text-muted">English, Maths, Hindi, etc.</small>
                </div>
              </Col>
              <Col md="3">
                <div className="border rounded p-3">
                  <i className="fas fa-book-open fa-2x text-success mb-2"></i>
                  <div><strong>~35 Books</strong></div>
                  <small className="text-muted">NCERT & Other</small>
                </div>
              </Col>
            </Row>
          </div>

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
                Uploading CBSE Data...
              </>
            ) : (
              <>
                <i className="fas fa-upload me-2"></i>
                Upload CBSE Board Data
              </>
            )}
          </Button>

          {uploading && (
            <div className="mt-3">
              <Alert color="info">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Uploading...</strong> Please wait while we create all the board data in Firestore.
                This may take a few moments.
              </Alert>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default CBSEUploadComponent;
