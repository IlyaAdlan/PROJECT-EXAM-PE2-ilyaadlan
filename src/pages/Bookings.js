import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./PageStyles.css";

function Bookings() {
  // Get current user and token from localStorage
  let user = null;
  let token = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
    token = localStorage.getItem('accessToken');
  } catch {}

  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [venuesMap, setVenuesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [booked, setBooked] = useState(false);
  const [bookingError, setBookingError] = useState("");
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

  useEffect(() => {
    async function fetchBookingsAndVenues() {
      setLoading(true);
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
          setLoading(false);
          return;
        }
        const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${encodeURIComponent(userName)}/bookings?_venue=true`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "X-Noroff-API-Key": "c4c8769a-ba1b-401d-9367-349cc75517f4"
          }
        });
        const data = await response.json();
        if (response.ok && Array.isArray(data.data)) {
          setBookings(data.data);
        } else if (response.status === 404) {
          setError(`No bookings found for user: ${userName}. Please check your username spelling and case in your profile.`);
        } else {
          setError(data.message || "Failed to fetch bookings.");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchBookingsAndVenues();
  }, []);

  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col md={10} lg={9}>
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary mb-2">Your Upcoming Bookings</h2>
            <p className="text-muted mb-0">See all your reservations and manage them easily.</p>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center mb-3">
        <Col md={6}>
          <input
            type="text"
            className="form-control"
            placeholder="Filter by venue name or date..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </Col>
      </Row>
      {showSuccess && (
        <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
          Booking successful!
          <button type="button" className="btn-close" aria-label="Close" onClick={() => { setShowSuccess(false); setBooked(false); }}></button>
        </div>
      )}
      {showError && (
        <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
          {bookingError || error}
          <button type="button" className="btn-close" aria-label="Close" onClick={() => { setShowError(false); setBookingError(""); setError(""); }}></button>
        </div>
      )}
      {loading ? (
        <div className="text-center mt-5">
          <span className="spinner-border" />
        </div>
      ) : (
        <>
          <Row className="g-4 justify-content-center">
            {bookings.length === 0 ? (
              <div className="text-center">No bookings found.</div>
            ) : (
              bookings.map((booking) => {
                const venue = booking.venue || null;
                return (
                  <Col key={booking.id} xs={12} md={6} lg={4}>
                    <Card className="h-100 shadow card-premium border-0 rounded-4">
                      <div style={{height: 140, background: venue && venue.media && venue.media.length > 0 ? `url('${venue.media[0].url}') center/cover` : `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80') center/cover`, borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem'}}></div>
                      <Card.Body className="d-flex flex-column justify-content-between">
                        <div>
                          <Card.Title className="fw-semibold text-primary">{venue ? venue.name : 'Venue'}</Card.Title>
                          <Card.Text className="mb-1 text-muted">{venue ? (venue.location?.address || '') : ''}</Card.Text>
                          <Card.Text className="mb-2">Max Guests: {venue ? venue.maxGuests : ''}</Card.Text>
                          <Card.Text className="mb-2">Price: {venue ? venue.price : ''}</Card.Text>
                          <Card.Text className="mb-1 text-muted">From: {booking.dateFrom}<br/>To: {booking.dateTo}</Card.Text>
                          <Card.Text className="mb-2">Guests: {booking.guests}</Card.Text>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mt-2 gap-2">
                          <Button variant="info" className="btn-premium flex-fill" onClick={() => { setDetailsBooking(booking); setShowDetails(true); }}>Details</Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })
            )}
          </Row>

          {/* Booking Details Modal */}
          <Button style={{display:'none'}} />
          <Modal show={showDetails} onHide={() => setShowDetails(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Booking Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {detailsBooking && (
                <>
                  <p><strong>Venue:</strong> {detailsBooking.venue?.name || detailsBooking.venue}</p>
                  <p><strong>Date:</strong> {detailsBooking.date}</p>
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
                      Authorization: token ? `Bearer ${token}` : undefined,
                      "X-Noroff-API-Key": "c4c8769a-ba1b-401d-9367-349cc75517f4"
                    },
                    body: JSON.stringify({ date: editDate })
                  });
                  if (response.ok) {
                    setShowEdit(false);
                    setShowSuccess(true);
                    // Refresh bookings list
                    const bookingsRes = await fetch("https://v2.api.noroff.dev/holidaze/bookings", {
                      headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                        "X-Noroff-API-Key": "c4c8769a-ba1b-401d-9367-349cc75517f4"
                      }
                    });
                    const bookingsData = await bookingsRes.json();
                    setBookings(bookingsData.data || []);
                  } else {
                    const data = await response.json();
                    setBookingError(data.message || "Booking update failed.");
                    setShowError(true);
                  }
                } catch {
                  setBookingError("Network error. Please try again.");
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

export default Bookings;
