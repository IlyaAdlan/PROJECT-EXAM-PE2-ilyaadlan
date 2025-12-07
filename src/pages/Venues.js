import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./PageStyles.css";

function Venues() {
  const [search, setSearch] = useState("");
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");

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

  // Sorting logic
  const sortedVenues = [...venues]
    .filter(v => v.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price") {
        return (a.price || 0) - (b.price || 0);
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "maxGuests") {
        return (a.maxGuests || 0) - (b.maxGuests || 0);
      }
      return 0;
    });

  // Pagination logic
  const isMobile = window.matchMedia('(max-width: 576px)').matches;
  const venuesPerPage = isMobile ? 8 : sortedVenues.length;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sortedVenues.length / venuesPerPage);
  const startIdx = (currentPage - 1) * venuesPerPage;
  const endIdx = startIdx + venuesPerPage;
  const displayedVenues = sortedVenues.slice(startIdx, endIdx);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4 fw-bold text-primary">Browse Venues</h1>
      <p className="text-center mb-3 fs-5 text-muted">Find the perfect place for your next stay. Click a venue to see more details and book instantly.</p>
      <div className="row justify-content-center mb-4">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search venues by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-2">
          <select
            className="form-select form-select-lg"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="">Sort by...</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
            <option value="maxGuests">Max Guests</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Row className="g-4 justify-content-center">
            {displayedVenues.map((venue) => (
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
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav aria-label="Venue pagination">
                <ul className="pagination pagination-sm">
                  {/* Show first page if not in visible range */}
                  {currentPage > 3 && (
                    <li className="page-item">
                      <button className="page-link" style={{ borderRadius: '1rem', minWidth: 32 }} onClick={() => handlePageChange(1)}>1</button>
                    </li>
                  )}
                  {/* Show ellipsis if needed */}
                  {currentPage > 4 && (
                    <li className="page-item disabled"><span className="page-link">...</span></li>
                  )}
                  {/* Show up to 5 pages centered around current */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    )
                    .map(page => (
                      <li key={page} className={`page-item${currentPage === page ? ' active' : ''}`}> 
                        <button className="page-link" style={{ borderRadius: '1rem', minWidth: 32 }} onClick={() => handlePageChange(page)}>{page}</button>
                      </li>
                    ))}
                  {/* Show ellipsis if needed */}
                  {currentPage < totalPages - 3 && (
                    <li className="page-item disabled"><span className="page-link">...</span></li>
                  )}
                  {/* Show last page if not in visible range */}
                  {currentPage < totalPages - 2 && (
                    <li className="page-item">
                      <button className="page-link" style={{ borderRadius: '1rem', minWidth: 32 }} onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </Container>
  );
}

export default Venues;
