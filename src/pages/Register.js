import React, { useState } from "react";
import { Form, Button, Container, Alert, Card, Row, Col } from "react-bootstrap";
import "./PageStyles.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess(false);
    setError("");
    try {
      const payload = {
        name,
        email,
        password,
        venueManager: role === "manager"
      };
      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        // Store venueManager status for fallback after login
        if (data && data.data && typeof data.data.venueManager !== 'undefined') {
          localStorage.setItem('venueManagerStatus', JSON.stringify({
            name: data.data.name,
            venueManager: data.data.venueManager
          }));
        }
      } else {
        // Show detailed error from API if available
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          setError(data.errors.map(e => e.message).join(' '));
        } else {
          setError(data.message || JSON.stringify(data) || "Registration failed.");
        }
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col md={8} lg={6}>
          <Card className="shadow-sm text-center card-premium">
            <Card.Body>
              <Card.Title as="h2" className="mb-3">Register</Card.Title>
              <Card.Text>Create a new account as a customer or venue manager.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form onSubmit={handleSubmit} className="mb-4">
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter stud.noroff.no email"
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mt-2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </Form.Group>
            <Form.Group controlId="formRole" className="mt-2">
              <Form.Label>Role</Form.Label>
              <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="customer">Customer</option>
                <option value="manager">Venue Manager</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3 w-100 btn-premium">
              Register
            </Button>
          </Form>
          {success && <Alert variant="success" className="mt-3">Registration successful!</Alert>}
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
