
import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './PageStyles.css';

function ManageVenues() {
      const [createMediaUrl, setCreateMediaUrl] = useState("");
      const [createAddress, setCreateAddress] = useState("");
      const [createCity, setCreateCity] = useState("");
      const [createZip, setCreateZip] = useState("");
      const [createCountry, setCreateCountry] = useState("");
    // Venue creation modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createName, setCreateName] = useState("");
    const [createDescription, setCreateDescription] = useState("");
    const [createPrice, setCreatePrice] = useState(100);
    const [createMaxGuests, setCreateMaxGuests] = useState(1);
    const [createDate, setCreateDate] = useState("");
  const [venues, setVenues] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 8;
  // Get current user's name
  let currentUserName = "";
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    currentUserName = user?.name || "";
  } catch {}

  // Only show venues owned by current user
  const filteredVenues = venues
    .filter(v => v.owner?.name === currentUserName)
    .filter(v => v.name.toLowerCase().includes(filter.toLowerCase()));
  const totalPages = Math.ceil(filteredVenues.length / venuesPerPage);
  const paginatedVenues = filteredVenues.slice((currentPage - 1) * venuesPerPage, currentPage * venuesPerPage);
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
    const [showDetails, setShowDetails] = useState(false);
    const [detailsVenue, setDetailsVenue] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [editVenue, setEditVenue] = useState(null);
    const [editName, setEditName] = useState("");
    // ...existing code...
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newVenueName, setNewVenueName] = useState("");
  const [created, setCreated] = useState(false);
  const [actionError, setActionError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  React.useEffect(() => {
    async function fetchVenues() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem('accessToken');
        let userName = "";
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          userName = user?.name || "";
        } catch {}
        if (!userName) throw new Error("No user name found");
        const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${userName}/venues`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "X-Noroff-API-Key": "c4c8769a-ba1b-401d-9367-349cc75517f4"
          }
        });
        const data = await response.json();
        if (response.ok) {
          setVenues(data.data || []);
        } else {
          setError(data.message || "Failed to fetch venues.");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchVenues();
  }, []);

  return (
    <React.Fragment>
      <Container className="py-5">
        <Row className="justify-content-center mb-4">
          <Col md={10} lg={9}>
            <Card className="shadow card-premium border-0 rounded-4">
              <Card.Body className="p-4 text-center">
                <h2 className="fw-bold text-primary mb-2">Manage Venues</h2>
                <p className="text-muted mb-0">Venue manager tools for creating, editing, and deleting venues.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {showSuccess && (
          <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
            Venue action successful!
            <button type="button" className="btn-close" aria-label="Close" onClick={() => { setShowSuccess(false); setCreated(false); }}></button>
          </div>
        )}
        {showError && (
          <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
            {actionError || error}
            <button type="button" className="btn-close" aria-label="Close" onClick={() => { setShowError(false); setActionError(""); setError(""); }}></button>
          </div>
        )}
        <Row className="justify-content-center mb-3">
          <Col md={6}>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Filter by venue name..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
          </Col>
        </Row>
        {loading ? (
          <div className="text-center mt-5">
            <span className="spinner-border" />
          </div>
        ) : (
          <>
            <Row className="g-4 justify-content-center">
              {paginatedVenues.length === 0 ? (
                <div className="text-center">No venues found.</div>
              ) : (
                paginatedVenues.map((venue) => (
                  <Col key={venue.id} xs={12} sm={6} md={4} lg={3}>
                    <Card className="h-100 shadow card-premium border-0 rounded-4">
                      <div style={{height: 140, background: venue.media && venue.media.length > 0 ? `url('${venue.media[0].url}') center/cover` : `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80') center/cover`, borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem'}}></div>
                      <Card.Body className="d-flex flex-column justify-content-between">
                        <div>
                          <Card.Title className="fw-semibold text-primary">{venue.name}</Card.Title>
                        </div>
                        <div className="d-flex flex-column gap-2 mt-2">
                          <Button variant="info" className="btn-premium w-100" onClick={() => { setDetailsVenue(venue); setShowDetails(true); }}>Details</Button>
                          <Button variant="warning" className="btn-premium w-100" onClick={() => { setEditVenue(venue); setEditName(venue.name); setShowEdit(true); }}>Edit</Button>
                          <Button variant="danger" className="btn-premium w-100" onClick={async () => {
                            setActionError("");
                            setShowSuccess(false);
                            setShowError(false);
                            try {
                              const token = localStorage.getItem('accessToken');
                              const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venue.id}`, {
                                method: "DELETE",
                                headers: {
                                  Authorization: token ? `Bearer ${token}` : undefined,
                                  "X-Noroff-API-Key": "c4c8769a-ba1b-401d-9367-349cc75517f4"
                                }
                              });
                              if (response.ok) {
                                setVenues(venues.filter(vv => vv.id !== venue.id));
                                setShowSuccess(true);
                              } else {
                                const data = await response.json();
                                setActionError(data.message || "Venue deletion failed.");
                                setShowError(true);
                              }
                            } catch {
                              setActionError("Network error. Please try again.");
                              setShowError(true);
                            }
                          }}>Delete</Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center mt-4 gap-2">
                <Button
                  variant="outline-primary"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, idx) => (
                  <Button
                    key={idx + 1}
                    variant={currentPage === idx + 1 ? "primary" : "outline-primary"}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </Button>
                ))}
                <Button
                  variant="outline-primary"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
        <Row className="justify-content-center mt-4">
          <Col md={4} className="text-center">
            <Button variant="success" className="btn-premium w-100" onClick={() => setShowCreateModal(true)}>
              Create New Venue
            </Button>
          </Col>
        </Row>
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Create Venue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={async (e) => {
              e.preventDefault();
              setCreated(false);
              setActionError("");
              setShowSuccess(false);
              setShowError(false);
              try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch("https://v2.api.noroff.dev/holidaze/venues", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : undefined,
                    "X-Noroff-API-Key": "c4c8769a-ba1b-401d-9367-349cc75517f4"
                  },
                  body: JSON.stringify({
                    name: createName,
                    description: createDescription,
                    location: {
                      address: createAddress,
                      city: createCity,
                      zip: createZip,
                      country: createCountry
                    },
                    price: createPrice,
                    maxGuests: createMaxGuests,
                    media: createMediaUrl ? [{ url: createMediaUrl }] : [],
                    date: createDate
                  })
                });
                if (response.ok) {
                  setCreated(true);
                  setShowSuccess(true);
                  setShowCreateModal(false);
                  setCreateName("");
                  setCreateDescription("");
                  setCreatePrice(100);
                  setCreateMaxGuests(1);
                  setCreateDate("");
                  // Refresh venues list
                  let userName = "";
                  try {
                    const user = JSON.parse(localStorage.getItem('user'));
                    userName = user?.name || "";
                  } catch {}
                  const venuesRes = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${userName}/venues`, {
                    headers: {
                      Authorization: token ? `Bearer ${token}` : undefined,
                      "X-Noroff-API-Key": "c4c8769a-ba1b-401d-9367-349cc75517f4"
                    }
                  });
                  const venuesData = await venuesRes.json();
                  setVenues(venuesData.data || []);
                } else {
                  const data = await response.json();
                  setActionError(data.message || JSON.stringify(data) || "Venue creation failed.");
                  setShowError(true);
                }
              } catch {
                setActionError("Network error. Please try again.");
                setShowError(true);
              }
            }}>
              <Form.Group className="mb-2" controlId="venueName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={createName} onChange={e => setCreateName(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-2" controlId="venueDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={2} value={createDescription} onChange={e => setCreateDescription(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-2" controlId="venuePrice">
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" min={1} value={createPrice} onChange={e => setCreatePrice(Number(e.target.value))} required />
              </Form.Group>
              <Form.Group className="mb-2" controlId="venueMaxGuests">
                <Form.Label>Max Guests</Form.Label>
                <Form.Control type="number" min={1} value={createMaxGuests} onChange={e => setCreateMaxGuests(Number(e.target.value))} required />
              </Form.Group>
              <Form.Group className="mb-2" controlId="venueAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" value={createAddress} onChange={e => setCreateAddress(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-2" controlId="venueCity">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" value={createCity} onChange={e => setCreateCity(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-2" controlId="venueZip">
                <Form.Label>Zip</Form.Label>
                <Form.Control type="text" value={createZip} onChange={e => setCreateZip(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-2" controlId="venueCountry">
                <Form.Label>Country</Form.Label>
                <Form.Control type="text" value={createCountry} onChange={e => setCreateCountry(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-2" controlId="venueMediaUrl">
                <Form.Label>Image URL</Form.Label>
                <Form.Control type="url" value={createMediaUrl} onChange={e => setCreateMediaUrl(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-2" controlId="venueDate">
                <Form.Label>Date</Form.Label>
                <Form.Control type="date" value={createDate} onChange={e => setCreateDate(e.target.value)} />
              </Form.Group>
              <Button variant="success" type="submit" className="w-100 btn-premium mt-2">Create Venue</Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
      {/* Venue Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Venue Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailsVenue && (
            <>
              <p><strong>Name:</strong> {detailsVenue.name}</p>
              <p><strong>ID:</strong> {detailsVenue.id}</p>
              {/* Add more venue details here as needed */}
              <button style={{width:'100%', marginTop:'12px'}} onClick={async () => {
                // ...existing code...
                setActionError("");
                setShowSuccess(false);
                setShowError(false);
                try {
                  const token = localStorage.getItem('accessToken');
                  const today = new Date().toISOString().split('T')[0];
                  const response = await fetch("https://v2.api.noroff.dev/holidaze/bookings", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: token ? `Bearer ${token}` : undefined
                    },
                    body: JSON.stringify({
                      venueId: detailsVenue.id,
                      dateFrom: today,
                      dateTo: today,
                      guests: 1
                    })
                  });
                  const data = await response.json();
                  if (response.ok) {
                    setShowSuccess(true);
                  } else {
                    setActionError(data.message || "Booking failed.");
                    setShowError(true);
                  }
                } catch (err) {
                  setActionError("Network error. Please try again.");
                  setShowError(true);
                }
              }}>Book Now</button>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>Close</Button>
          <button style={{marginLeft:'8px'}} onClick={async () => {
            setActionError("");
            setShowSuccess(false);
            setShowError(false);
            try {
              const token = localStorage.getItem('accessToken');
              const today = new Date().toISOString().split('T')[0];
              const response = await fetch("https://v2.api.noroff.dev/holidaze/bookings", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token ? `Bearer ${token}` : undefined
                },
                body: JSON.stringify({
                  venueId: detailsVenue?.id,
                  dateFrom: today,
                  dateTo: today,
                  guests: 1
                })
              });
              const data = await response.json();
              if (response.ok) {
                setShowSuccess(true);
              } else {
                setActionError(data.message || "Booking failed.");
                setShowError(true);
              }
            } catch (err) {
              setActionError("Network error. Please try again.");
              setShowError(true);
            }
          }}>Book Now</button>
        </Modal.Footer>
      </Modal>
      {/* Venue Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Venue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={async (e) => {
            e.preventDefault();
            setShowSuccess(false);
            setShowError(false);
            try {
              const token = localStorage.getItem('accessToken');
                const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${editVenue.id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : undefined,
                    "X-Noroff-API-Key": "c4c8769a-ba1b-401d-9367-349cc75517f4"
                  },
                  body: JSON.stringify({ name: editName })
                });
              if (response.ok) {
                setShowEdit(false);
                setShowSuccess(true);
                // Refresh venues list
                const venuesRes = await fetch("https://v2.api.noroff.dev/holidaze/venues", {
                  headers: { Authorization: token ? `Bearer ${token}` : undefined }
                });
                const venuesData = await venuesRes.json();
                setVenues(venuesData.data || []);
              } else {
                const data = await response.json();
                setActionError(data.message || "Venue update failed.");
                setShowError(true);
              }
            } catch {
              setActionError("Network error. Please try again.");
              setShowError(true);
            }
          }}>
            <Form.Group controlId="editVenueName">
              <Form.Label>Venue Name</Form.Label>
              <Form.Control type="text" value={editName} onChange={e => setEditName(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">Save Changes</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default ManageVenues;
