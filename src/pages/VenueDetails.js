import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Container, Spinner, Button, Row, Col } from "react-bootstrap";
import "./PageStyles.css";

function VenueDetails() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const res = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`);
        const data = await res.json();
        setVenue(data.data);
      } catch (error) {
        setVenue(null);
      } finally {
        setLoading(false);
      }
    }
    fetchVenue();
  }, [id]);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!venue) {
    return (
      <Container className="mt-5 text-center">
        <h2>Venue not found</h2>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={9}>
          <Card className="shadow card-premium border-0 rounded-4">
            <Row className="g-0">
              <Col md={6} className="d-flex align-items-stretch">
                <div style={{
                  background: venue.media && venue.media.length > 0 ? `url('${venue.media[0].url}') center/cover` : `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80') center/cover`,
                  minHeight: 340,
                  borderTopLeftRadius: '1.5rem',
                  borderBottomLeftRadius: '1.5rem',
                  width: '100%'
                }}></div>
              </Col>
              <Col md={6} className="p-4 d-flex flex-column justify-content-between">
                <div>
                  <h2 className="fw-bold text-primary mb-2">{venue.name}</h2>
                  <div className="mb-3 text-muted">{venue.location && typeof venue.location === 'object'
                    ? `${venue.location.address || ''}, ${venue.location.city || ''}, ${venue.location.zip || ''}, ${venue.location.country || ''}`
                    : venue.location}
                  </div>
                  <div className="mb-3 fs-5">{venue.description}</div>
                  <div className="mb-2"><span className="fw-bold text-success fs-4">${venue.price}</span> <span className="text-muted">/ night</span></div>
                  <div className="mb-2 text-muted">Max Guests: {venue.maxGuests}</div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="primary"
                    className="btn-premium w-100 fs-5 py-3"
                    style={{fontWeight: 700, fontSize: '1.2rem'}}
                    onClick={async () => {
                      setSuccess(false);
                      setError("");
                      try {
                        const token = localStorage.getItem('accessToken');
                        const user = JSON.parse(localStorage.getItem('user'));
                        const userName = user?.name;
                        const today = new Date().toISOString().split('T')[0];
                        const payload = {
                          venueId: venue.id,
                          dateFrom: today,
                          dateTo: today,
                          guests: 1,
                          customerName: userName
                        };
                        const response = await fetch("https://v2.api.noroff.dev/holidaze/bookings", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: token ? `Bearer ${token}` : undefined,
                            "X-Noroff-API-Key": "c4c8769a-ba1b-401d-9367-349cc75517f4"
                          },
                          body: JSON.stringify(payload)
                        });
                        const data = await response.json();
                        if (response.ok) {
                          setSuccess(true);
                        } else {
                          setError(data.message || "Booking failed.");
                        }
                      } catch (err) {
                        setError("Network error. Please try again.");
                      }
                    }}
                  >
                    Book Now
                  </Button>
                  {success && (
                    <div className="alert alert-success mt-3">Booking successful!</div>
                  )}
                  {error && (
                    <div className="alert alert-danger mt-3">{error}</div>
                  )}
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default VenueDetails;
