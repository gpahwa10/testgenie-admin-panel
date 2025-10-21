import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Badge,
} from 'reactstrap';
import { usersService } from '../../services/usersService';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await usersService.getUserById(id);
        setUser(userData);
        console.log('User details:', userData);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to fetch user details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const getCreditsBadgeColor = (credits) => {
    if (credits >= 200) return 'success';
    if (credits >= 100) return 'info';
    if (credits >= 50) return 'warning';
    return 'danger';
  };

  const handleBack = () => {
    navigate('/admin/users');
  };

  if (loading) {
    return (
      <>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8"></div>
        <Container className="mt--7 mb-5" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardBody className="text-center py-5">
                  <Spinner color="primary" />
                  <span className="ml-2">Loading user details...</span>
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8"></div>
        <Container className="mt--7 mb-5" fluid>
          <Row>
            <div className="col">
              <Alert color="danger" className="mb-4">
                {error}
              </Alert>
              <Button color="primary" onClick={handleBack}>
                Back to Users
              </Button>
            </div>
          </Row>
        </Container>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8"></div>
        <Container className="mt--7 mb-5" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardBody className="text-center py-5">
                  <h4>User not found</h4>
                  <Button color="primary" onClick={handleBack}>
                    Back to Users
                  </Button>
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8"></div>
      <Container className="mt--7 mb-5" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex align-items-center justify-content-between">
                <h3 className="mb-0">User Details</h3>
                {/* <Button color="secondary" onClick={handleBack}>
                  Back to Users
                </Button> */}
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="4">
                    <div className="text-center mb-4">
                      <img
                        alt="User Avatar"
                        src={user.image || require("../../assets/img/theme/team-1-800x800.jpg")}
                        className="rounded-circle"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      />
                    </div>
                  </Col>
                  <Col md="8">
                    <h4 className="mb-3">{user.name || user.displayName || 'N/A'}</h4>
                    
                    <Row className="mb-3">
                      <Col md="6">
                        <strong>Email:</strong>
                        <p className="text-muted">{user.email || 'N/A'}</p>
                      </Col>
                      <Col md="6">
                        <strong>Phone:</strong>
                        <p className="text-muted">{user.phone || user.phoneNumber || 'N/A'}</p>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md="6">
                        <strong>School:</strong>
                        <p className="text-muted">{user.school || user.schoolName || 'N/A'}</p>
                      </Col>
                      <Col md="6">
                        <strong>Credits:</strong>
                        <div className="mt-1">
                          <Badge color={getCreditsBadgeColor(user.credit || 0)} className="badge-dot mr-4">
                            <i className={`bg-${getCreditsBadgeColor(user.credit || 0)}`} />
                            {user.credit || 0} Credits
                          </Badge>
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md="6">
                        <strong>User ID:</strong>
                        <p className="text-muted">{user.uid || user.id || 'N/A'}</p>
                      </Col>
                      <Col md="6">
                        <strong>Document ID:</strong>
                        <p className="text-muted">{user.id || 'N/A'}</p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default UserDetails