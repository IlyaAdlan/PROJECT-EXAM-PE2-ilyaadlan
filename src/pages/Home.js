import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./PageStyles.css";

function Home() {
  const [search, setSearch] = useState("");
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchVenues() {
      setLoading(true);
      try {
        const res = await fetch("https://v2.api.noroff.dev/holidaze/venues");
        const data = await res.json();
        let venuesList = data.data || [];
        let featured = venuesList.slice(0, 3);
        while (featured.length < 3) {
          featured.push({
            id: `placeholder-${featured.length}`,
            name: "More venues coming soon",
            media: [{ url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" }],
            location: { address: "" },
            maxGuests: "-",
            price: "-"
          });
        }
        setVenues(featured);
      } catch {
        setVenues([
          {
            id: "placeholder-1",
            name: "More venues coming soon",
            media: [{ url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" }],
            location: { address: "" },
            maxGuests: "-",
            price: "-"
          },
          {
            id: "placeholder-2",
            name: "More venues coming soon",
            media: [{ url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" }],
            location: { address: "" },
            maxGuests: "-",
            price: "-"
          },
          {
            id: "placeholder-3",
            name: "More venues coming soon",
            media: [{ url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" }],
            location: { address: "" },
            maxGuests: "-",
            price: "-"
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchVenues();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search)}`);
    }
  }

  return (
    <div className="home-bg min-vh-100 d-flex flex-column">
      {/* Hero Section */}
      <div style={{
        background: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80') center/cover",
        minHeight: 340,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.85)',
          borderRadius: 24,
          padding: '2.5rem 2rem',
          maxWidth: 540,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)'
        }}>
          <h1 className="fw-bold mb-3 text-primary">Book Your Next Getaway</h1>
          <p className="mb-4 fs-5">Find and book unique venues across Norway.</p>
          <Form onSubmit={handleSearch} className="d-flex gap-2 justify-content-center">
            <Form.Control
              type="text"
              placeholder="Search by location, venue, or keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ maxWidth: 300 }}
            />
            <Button type="submit" variant="primary" className="btn-premium px-4">Search</Button>
          </Form>
        </div>
      </div>

      {/* Featured Venues */}
      <Container className="flex-grow-1 py-5">
        <h2 className="text-center mb-4 fw-bold text-secondary">Featured Venues</h2>
        <Row className="g-4 justify-content-center">
          {venues.map((venue) => (
            <Col key={venue.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow card-hover rounded-4 border-0">
                <div style={{height: 180, background: venue.media && venue.media.length > 0 ? `url('${venue.media[0].url}') center/cover` : `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80') center/cover`, borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem'}}></div>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="fw-semibold text-primary">{venue.name}</Card.Title>
                    <Card.Text className="mb-1 text-muted">{venue.location?.address || "No address"}</Card.Text>
                    <Card.Text className="mb-2">Max Guests: {venue.maxGuests}</Card.Text>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-2">
                    <span className="fw-bold fs-5 text-success">${venue.price || 99}/night</span>
                    <Button as={Link} to={`/venue/${venue.id}`} variant="primary" className="btn-premium px-4">Book Now</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Home;
