import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Input,
  Button,
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader";
const UserProfile = () => {
  return (
    <>
      <UserHeader />
      {/* Page content */}
      <div style={{ width: "100%", padding: "0 2rem 2rem 2rem", boxSizing: "border-box" }}>
      <Container className="mt--7"fluid>
        <Col >
          <Card className="bg-secondary shadow">
            <CardHeader className="bg-white border-0">
              <Row className="align-items-center">
                <Col xs="8">
                  <h3 className="mb-0">Account Settings</h3>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Form>
                <h6 className="heading-small text-muted mb-4">
                  Admin Information
                </h6>
                <div className="pl-lg-4">
                  <Col lg="6">
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-email"
                      >
                        Email address
                      </label>
                      <Input
                        className="form-control-alternative"
                        id="input-email"
                        placeholder="admin@admin.com"
                        type="email"
                      />
                    </FormGroup>
                  </Col>

                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-first-name"
                        >
                          First name
                        </label>
                        <Input
                          className="form-control-alternative"
                          defaultValue="Admin"
                          id="input-first-name"
                          placeholder="First name"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-last-name"
                        >
                          Last name
                        </label>
                        <Input
                          className="form-control-alternative"
                          defaultValue="Testgenie"
                          id="input-last-name"
                          placeholder="Last name"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <hr className="my-4" />
                {/* Address */}
                <h6 className="heading-small text-muted mb-4">
                  Important Variables
                </h6>
                <div className="pl-lg-4 mb-4">
                  <Col md="12">
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-address"
                      >
                        OpenAI API Key
                      </label>
                      <Input
                        className="form-control-alternative"
                        defaultValue="XXXXXXXXXXXXXXXXXXXXXXXX"
                        id="input-openai-api-key"
                        placeholder="OpenAI API Key"
                        type="text"
                      />
                    </FormGroup>
                  </Col>

                  <Col md="12">
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-city"
                      >
                        Razorpay API Key ID
                      </label>
                      <Input
                        className="form-control-alternative"
                        defaultValue="XXXXXXXXXXXXXXXXXXXXXX"
                        id="input-razorpay-api-key-id"
                        placeholder="Razorpay API Key ID"
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-country"
                      >
                        Razorpay API Key Secret
                      </label>
                      <Input
                        className="form-control-alternative"
                        defaultValue="XXXXXXXXXXXXXXXXXXXXXX"
                        id="input-razorpay-api-key-secret"
                        placeholder="Razorpay API Key Secret"
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Container>
      </div>
    </>
  );
};

export default UserProfile;
