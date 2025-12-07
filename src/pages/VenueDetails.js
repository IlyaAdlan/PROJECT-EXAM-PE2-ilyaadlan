import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Container, Spinner, Button } from "react-bootstrap";

function VenueDetails() {
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
      <Container className="mt-4">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!venue) {
    return (
      <Container className="mt-4">
        <h2>Venue not found</h2>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>{venue.name}</Card.Title>
          <Card.Text>{venue.description}</Card.Text>
          <Card.Text>Max Guests: {venue.maxGuests}</Card.Text>
          <Card.Text>Address: {venue.location?.address || "No address"}</Card.Text>
          <Button variant="primary">Book Now</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default VenueDetails;
