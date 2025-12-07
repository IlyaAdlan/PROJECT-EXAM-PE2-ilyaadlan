import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./PageStyles.css";

function Profile() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Get current username and email from localStorage for display
  let userName = null;
  let userEmail = null;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    userName = user?.name || null;
    userEmail = user?.email || null;
  } catch {}

  const [avatar, setAvatar] = useState("");
  const [editAvatar, setEditAvatar] = useState(false);
  const [newAvatar, setNewAvatar] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  React.useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem('accessToken');
        let user = null;
        try {
          user = JSON.parse(localStorage.getItem('user'));
        } catch {}
        const userName = user?.name;
        if (!userName) return;
        const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${encodeURIComponent(userName)}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "X-Noroff-API-Key": "97ff17b2-b2b3-419f-b421-537dd89f8294"
          }
        });
        const data = await response.json();
        if (response.ok && data.data) {
          setAvatar(data.data.avatar || "");
        } else {
          setError("Profile not found. Please check your username or register.");
          setShowError(true);
        }
      } catch {
        setError("Network error. Please try again.");
        setShowError(true);
      }
    }
    fetchProfile();
  }, []);

  async function handleAvatarUpdate(e) {
    e.preventDefault();
    setSuccess(false);
    setError("");
    try {
      const token = localStorage.getItem('accessToken');
      let user = null;
      try {
        user = JSON.parse(localStorage.getItem('user'));
      } catch {}
      const userName = user?.name;
      if (!userName) {
        setError("User info not found. Please log in again.");
        setShowError(true);
        return;
      }
      const response = await fetch(`https://v2.api.noroff.dev/profiles/${encodeURIComponent(userName)}/media`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
          "X-Noroff-API-Key": "97ff17b2-b2b3-419f-b421-537dd89f8294"
        },
        body: JSON.stringify({ avatar: newAvatar })
      });
      if (response.ok) {
        setAvatar(newAvatar);
        setEditAvatar(false);
        setNewAvatar("");
        setSuccess(true);
        setShowSuccess(true);
      } else {
        const data = await response.json();
        setError(data.message || "Update failed.");
        setShowError(true);
      }
    } catch {
      setError("Network error. Please try again.");
      setShowError(true);
    }
  }

  return (
    <Container className="py-5" style={{ minHeight: '80vh', background: '#f8fafc' }}>
      <Row className="justify-content-center">
        <Col md={7} lg={6}>
          <Card className="shadow border-0 rounded-4 p-3" style={{ background: '#fff' }}>
            <Card.Body>
              <div className="d-flex flex-column align-items-center mb-4">
                <div
                  style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 10px #e0e0e0', marginBottom: 16, background: '#f0f0f0', cursor: 'pointer' }}
                  title="Click to change avatar"
                  onClick={() => setEditAvatar(true)}
                >
                  <img
                    src={avatar || "https://ui-avatars.com/api/?name=" + (userName || "User") + "&background=0D8ABC&color=fff"}
                    alt="Avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h3 className="fw-bold mt-2">{userName}</h3>
                <div className="text-muted mb-2">{userEmail}</div>
              </div>
              {editAvatar ? (
                <Form onSubmit={handleAvatarUpdate} className="mb-3">
                  <Form.Group controlId="formAvatarUrl">
                    <Form.Label>New Avatar URL</Form.Label>
                    <Form.Control
                      type="url"
                      value={newAvatar}
                      onChange={e => setNewAvatar(e.target.value)}
                      placeholder="Paste image URL"
                      required
                    />
                  </Form.Group>
                  <div className="d-flex gap-2 mt-2">
                    <Button type="submit" variant="primary">Update</Button>
                    <Button variant="secondary" onClick={() => setEditAvatar(false)}>Cancel</Button>
                  </div>
                </Form>
              ) : (
                <Button variant="outline-primary" onClick={() => setEditAvatar(true)} className="mb-3">Change Avatar</Button>
              )}
              {showSuccess && <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>Avatar updated successfully!</Alert>}
              {showError && <Alert variant="danger" onClose={() => setShowError(false)} dismissible>{error}</Alert>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
