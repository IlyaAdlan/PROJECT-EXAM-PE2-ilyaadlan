import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Venues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const res = await fetch("https://v2.api.noroff.dev/holidaze/venues");
        const data = await res.json();
        setVenues(data.data || []);
      } catch (error) {
        setVenues([]);
      } finally {
        setLoading(false);
      }
    }
    fetchVenues();
  }, []);

  return (
    <Container className="mt-4">
      <h1>Venues List</h1>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Row>
          {venues.map((venue) => (
            <Col key={venue.id} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{venue.name}</Card.Title>
                  <Card.Text>{venue.location?.address || "No address"}</Card.Text>
                  <Card.Text>Max Guests: {venue.maxGuests}</Card.Text>
                  <Button
                    as={Link}
                    to={`/venue/${venue.id}`}
                    variant="primary"
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Venues;
