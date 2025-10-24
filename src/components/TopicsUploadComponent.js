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
  Table,
  Badge
} from 'reactstrap';
import { uploadTopicsToBooks, getTopicsStats, previewTopicsMapping } from 'api/uploadTopicsToBooks';

const TopicsUploadComponent = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // Get stats when component mounts
    const topicsStats = getTopicsStats();
    setStats(topicsStats);
    
    // Get preview of topics mapping
    const topicsPreview = previewTopicsMapping();
    setPreview(topicsPreview);
  }, []);

  const handleUpload = async () => {
    try {
      setUploading(true);
      setError(null);
      setUploadResult(null);

      console.log('🚀 Starting topics upload to books...');
      const result = await uploadTopicsToBooks();
      
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
      <CardHeader className="bg-gradient-info text-white">
        <h3 className="mb-0">
          <i className="fas fa-bookmark me-2"></i>
          Upload Topics to Books Collection
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
                  <strong>Total Books:</strong> {uploadResult.totalBooks}
                </Col>
                <Col md="3">
                  <strong>Matched Books:</strong> {uploadResult.matchedBooks}
                </Col>
                <Col md="3">
                  <strong>Total Topics:</strong> {uploadResult.totalTopics}
                </Col>
                <Col md="3">
                  <strong>Batches:</strong> {uploadResult.batches}
                </Col>
              </Row>
            </div>
          </Alert>
        )}

        {stats && (
          <div className="mb-4">
            <h5 className="mb-3">📊 Topics Data Overview (from topics.json)</h5>
            <Row className="text-center mb-4">
              <Col md="3">
                <div className="border rounded p-3 bg-light">
                  <i className="fas fa-school fa-2x text-primary mb-2"></i>
                  <div><strong>{stats.totalBoards} Boards</strong></div>
                  <small className="text-muted">CBSE, ICSE, PSEB, BSEB</small>
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
                  <small className="text-muted">English, Maths, Hindi, etc.</small>
                </div>
              </Col>
              <Col md="3">
                <div className="border rounded p-3 bg-light">
                  <i className="fas fa-bookmark fa-2x text-success mb-2"></i>
                  <div><strong>{stats.totalTopics} Topics</strong></div>
                  <small className="text-muted">Chapters & Lessons</small>
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
                  <th>Topics</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.boards).map(([boardName, boardStats]) => (
                  <tr key={boardName}>
                    <td><strong>{boardName}</strong></td>
                    <td>{boardStats.classes}</td>
                    <td>{boardStats.subjects}</td>
                    <td>{boardStats.topics}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        <div className="mb-4">
          <h5 className="mb-3">🔍 Topics Mapping Preview</h5>
          <p className="text-muted mb-3">
            This shows how topics from topics.json will be mapped to existing books in Firestore.
          </p>
          
          {preview && (
            <div className="border rounded p-3 bg-light">
              <h6>Sample Mappings:</h6>
              {Object.entries(preview).slice(0, 5).map(([key, topics]) => (
                <div key={key} className="mb-2">
                  <Badge color="primary" className="me-2">{key}</Badge>
                  <span className="text-muted">
                    {topics.length} topics: {topics.slice(0, 2).map(t => t.name).join(', ')}
                    {topics.length > 2 && ` +${topics.length - 2} more`}
                  </span>
                </div>
              ))}
              {Object.keys(preview).length > 5 && (
                <div className="text-muted">
                  ... and {Object.keys(preview).length - 5} more mappings
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center">
          <h5 className="mb-3">🚀 Upload Topics to Existing Books</h5>
          <p className="text-muted mb-4">
            This will add topics arrays to existing book documents in Firestore by matching 
            the data from category.json and topics.json files.
          </p>
          
          <Alert color="info" className="mb-4">
            <i className="fas fa-info-circle me-2"></i>
            <strong>How it works:</strong> The script will match existing books with topics from topics.json 
            based on board, class, and subject, then add a topics array to each book document.
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
                Uploading Topics...
              </>
            ) : (
              <>
                <i className="fas fa-upload me-2"></i>
                Upload Topics to Books
              </>
            )}
          </Button>

          {uploading && (
            <div className="mt-3">
              <Alert color="info">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Uploading...</strong> Please wait while we match topics with existing books 
                and update the books collection. This may take a few minutes.
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

export default TopicsUploadComponent;
