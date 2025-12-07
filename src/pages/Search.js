import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card, Spinner } from "react-bootstrap";
import "./PageStyles.css";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`https://v2.api.noroff.dev/holidaze/venues?search=${query}`);
      const data = await res.json();
      setResults(data.data || []);
    } catch (error) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col md={8} lg={6}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <Card.Title as="h2" className="mb-3">Search Venues</Card.Title>
              <Card.Text>Find a venue by name and view details.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Form onSubmit={handleSearch} className="mb-4">
        <Row className="justify-content-center">
          <Col md={6}>
            <Form.Group controlId="searchQuery">
              <Form.Label>Venue Name</Form.Label>
              <Form.Control
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter venue name"
              />
            </Form.Group>
          </Col>
          <Col md={2} className="d-flex align-items-end">
            <Button type="submit" variant="primary" className="w-100">
              Search
            </Button>
          </Col>
        </Row>
      </Form>
      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row className="g-3 justify-content-center">
          {results.map((venue) => (
            <Col key={venue.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title>{venue.name}</Card.Title>
                    <Card.Text>{venue.location?.address || "No address"}</Card.Text>
                    <Card.Text>Max Guests: {venue.maxGuests}</Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Search;




