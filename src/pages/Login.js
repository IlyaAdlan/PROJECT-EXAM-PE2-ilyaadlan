import React, { useState } from "react";
import { Form, Button, Container, Alert, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./PageStyles.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess(false);
    setError("");
    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/login?_holidaze=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password
        })
      });
      const data = await response.json();
      if (response.ok && data && data.data && data.data.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
        // Fetch full user profile to get venueManager property
        try {
          const profileUrl = `https://v2.api.noroff.dev/holidaze/profiles/${encodeURIComponent(data.data.name)}`;
          const profileHeaders = {
            Authorization: `Bearer ${data.data.accessToken}`,
            "X-Noroff-API-Key": "97ff17b2-b2b3-419f-b421-537dd89f8294"
          };
          const profileRes = await fetch(profileUrl, {
            headers: profileHeaders
          });
          const profileData = await profileRes.json();
          if (profileRes.ok && profileData.data) {
            // Merge accessToken into profile object for convenience
            const fullUser = { ...profileData.data, accessToken: data.data.accessToken };
            localStorage.setItem('user', JSON.stringify(fullUser));
            localStorage.removeItem('venueManagerStatus');
          } else {
            // Fallback: store login data and try to restore venueManager from registration
            let fallbackUser = { ...data.data };
            try {
              const venueManagerStatus = JSON.parse(localStorage.getItem('venueManagerStatus'));
              if (venueManagerStatus && venueManagerStatus.name === data.data.name) {
                fallbackUser.venueManager = venueManagerStatus.venueManager;
              } else {
                fallbackUser.venueManager = false;
              }
            } catch {
              fallbackUser.venueManager = false;
            }
            localStorage.setItem('user', JSON.stringify(fallbackUser));
            localStorage.removeItem('venueManagerStatus');
          }
        } catch (profileErr) {
          // Fallback: store login data and try to restore venueManager from registration
          let fallbackUser = { ...data.data };
          try {
            const venueManagerStatus = JSON.parse(localStorage.getItem('venueManagerStatus'));
            if (venueManagerStatus && venueManagerStatus.name === data.data.name) {
              fallbackUser.venueManager = venueManagerStatus.venueManager;
            } else {
              fallbackUser.venueManager = false;
            }
          } catch {
            fallbackUser.venueManager = false;
          }
          localStorage.setItem('user', JSON.stringify(fallbackUser));
          localStorage.removeItem('venueManagerStatus');
        }
        setSuccess(true);
        navigate('/');
        window.location.reload();
      } else {
        setError(data.message || "Login failed.");
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
                <Card.Title as="h2" className="mb-3">Login</Card.Title>
                <Card.Text>Access your account to book and manage venues.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={6}>
            <Form onSubmit={handleSubmit} className="mb-4">
              <Form.Group controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
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
              <Button variant="primary" type="submit" className="mt-3 w-100 btn-premium">
                Login
              </Button>
            </Form>
            {success && <Alert variant="success" className="mt-3">Login successful!</Alert>}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Col>
        </Row>
      </Container>
    );
}

export default Login;
