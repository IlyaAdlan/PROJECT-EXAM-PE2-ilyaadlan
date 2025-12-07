
import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './PageStyles.css';

function ManageBookings() {
  const navigate = useNavigate();
  // Role check: Only allow venue managers
  let isVenueManager = false;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    isVenueManager = user?.venueManager === true;
  } catch {}
  useEffect(() => {
    if (!isVenueManager) {
      navigate('/');
    }
  }, [navigate, isVenueManager]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [managed, setManaged] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsBooking, setDetailsBooking] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editBooking, setEditBooking] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  React.useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch("https://v2.api.noroff.dev/holidaze/bookings", {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "X-Noroff-API-Key": "c4c8769a-ba1b-401d-9367-349cc75517f4"
          }
        });
        const data = await response.json();
        if (response.ok) {
          setBookings(data.data || []);
        } else {
          setError(data.message || "Failed to fetch bookings.");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  return (
    <Container className="py-5">
      <Row className="justify-content-center mb-4">
        <Col md={10} lg={9}>
          <Card className="shadow card-premium border-0 rounded-4">
            <Card.Body className="p-4 text-center">
              <h2 className="fw-bold text-primary mb-2">Manage Bookings</h2>
              <p className="text-muted mb-0">View and manage bookings for your venues.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center mb-3">
        <Col md={6}>
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Filter by venue name or date..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </Col>
      </Row>
      {showSuccess && (
        <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
          Booking cancelled successfully!
          <button type="button" className="btn-close" aria-label="Close" onClick={() => { setShowSuccess(false); setManaged(false); }}></button>
        </div>
      )}
      {showError && (
        <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
          {error}
          <button type="button" className="btn-close" aria-label="Close" onClick={() => { setShowError(false); setError(""); }}></button>
        </div>
      )}
      {loading ? (
        <div className="text-center mt-5">
          <span className="spinner-border" />
        </div>
      ) : (
        <>
          <Row className="g-4 justify-content-center">
            {bookings.filter(b =>
              b.venue?.name?.toLowerCase().includes(filter.toLowerCase()) ||
              b.date?.toLowerCase().includes(filter.toLowerCase())
            ).length === 0 ? (
              <div className="text-center">No bookings found.</div>
            ) : (
              bookings.filter(b =>
                b.venue?.name?.toLowerCase().includes(filter.toLowerCase()) ||
                b.date?.toLowerCase().includes(filter.toLowerCase())
              ).map((booking) => (
                <Col key={booking.id} xs={12} sm={6} md={4} lg={3}>
                  <Card className="h-100 shadow card-premium border-0 rounded-4">
                    <div style={{height: 140, background: booking.venue?.media && booking.venue.media.length > 0 ? `url('${booking.venue.media[0].url}') center/cover` : `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80') center/cover`, borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem'}}></div>
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <div>
                        <Card.Title className="fw-semibold text-primary">{booking.venue?.name || booking.venue}</Card.Title>
                        <Card.Text className="mb-2">
                          <span className="d-block"><strong>Date:</strong> {booking.date}</span>
                          <span className="d-block"><strong>Customer:</strong> {booking.customer}</span>
                        </Card.Text>
                      </div>
                      <div className="d-flex flex-column gap-2 mt-2">
                        <Button variant="info" className="btn-premium w-100" onClick={() => { setDetailsBooking(booking); setShowDetails(true); }}>Details</Button>
                        <Button variant="warning" className="btn-premium w-100" onClick={() => { setEditBooking(booking); setEditDate(booking.date); setShowEdit(true); }}>Edit</Button>
                        <Button variant="danger" className="btn-premium w-100" onClick={async () => {
                          setManaged(false);
                          setError("");
                          setShowSuccess(false);
                          setShowError(false);
                          try {
                            const token = localStorage.getItem('accessToken');
                            const response = await fetch(`https://v2.api.noroff.dev/holidaze/bookings/${booking.id}`, {
                              method: "DELETE",
                              headers: {
                                Authorization: token ? `Bearer ${token}` : undefined
                              }
                            });
                            if (response.ok) {
                              setManaged(true);
                              setBookings(bookings.filter(b => b.id !== booking.id));
                              setShowSuccess(true);
                            } else {
                              const data = await response.json();
                              setError(data.message || "Booking management failed.");
                              setShowError(true);
                            }
                          } catch {
                            setError("Network error. Please try again.");
                            setShowError(true);
                          }
                        }}>Cancel Booking</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          {/* Booking Details Modal */}
          <Button style={{display:'none'}} /> {/* React-bootstrap Modal needs at least one Button in scope */}
          <Modal show={showDetails} onHide={() => setShowDetails(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Booking Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {detailsBooking && (
                <>
                  <p><strong>Venue:</strong> {detailsBooking.venue?.name || detailsBooking.venue}</p>
                  <p><strong>Date:</strong> {detailsBooking.date}</p>
                  <p><strong>Customer:</strong> {detailsBooking.customer}</p>
                  <p><strong>ID:</strong> {detailsBooking.id}</p>
                  {/* Add more booking details as needed */}
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDetails(false)}>Close</Button>
            </Modal.Footer>
          </Modal>

          {/* Booking Edit Modal */}
          <Modal show={showEdit} onHide={() => setShowEdit(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Booking</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setShowSuccess(false);
                setShowError(false);
                try {
                  const token = localStorage.getItem('accessToken');
                  const response = await fetch(`https://v2.api.noroff.dev/holidaze/bookings/${editBooking.id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: token ? `Bearer ${token}` : undefined
                    },
                    body: JSON.stringify({ date: editDate })
                  });
                  if (response.ok) {
                    setShowEdit(false);
                    setShowSuccess(true);
                    // Refresh bookings list
                    const bookingsRes = await fetch("https://v2.api.noroff.dev/holidaze/bookings", {
                      headers: { Authorization: token ? `Bearer ${token}` : undefined }
                    });
                    const bookingsData = await bookingsRes.json();
                    setBookings(bookingsData.data || []);
                  } else {
                    const data = await response.json();
                    setError(data.message || "Booking update failed.");
                    setShowError(true);
                  }
                } catch {
                  setError("Network error. Please try again.");
                  setShowError(true);
                }
              }}>
                <label htmlFor="editDate">Date</label>
                <input
                  id="editDate"
                  type="text"
                  className="form-control mb-2"
                  value={editDate}
                  onChange={e => setEditDate(e.target.value)}
                  required
                />
                <Button variant="primary" type="submit" className="mt-2">Save Changes</Button>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </Container>
  );
}

export default ManageBookings;
