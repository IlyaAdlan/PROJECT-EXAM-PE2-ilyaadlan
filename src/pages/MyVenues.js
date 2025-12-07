import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Container, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

function MyVenues() {
      // Edit Modal Handler
      const handleEditSubmit = async (e) => {
        e.preventDefault();
        setActionError("");
        setActionSuccess("");
        try {
          const token = localStorage.getItem('accessToken');
          const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${editVenue.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : undefined,
              "X-Noroff-API-Key": "c4c8769a-ba1b-401d-9367-349cc75517f4"
            },
            body: JSON.stringify({
              name: editName,
              description: editDescription,
              location: {
                address: editAddress,
                city: editCity,
                zip: editZip,
                country: editCountry
              },
              price: editPrice,
              maxGuests: editMaxGuests,
              media: editMediaUrl ? [{ url: editMediaUrl }] : []
            })
          });
          if (response.ok) {
            setActionSuccess("Venue updated successfully.");
            setShowEdit(false);
            // Refresh venues
            const user = JSON.parse(localStorage.getItem('user'));
            const profileName = user?.name;
            const venuesRes = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${profileName}/venues`, {
              headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
                "X-Noroff-API-Key": "c4c8769a-ba1b-401d-9367-349cc75517f4"
              }
            });
            const venuesData = await venuesRes.json();
            setVenues(venuesData.data || []);
          } else {
            const data = await response.json();
            setActionError(data.message || "Venue update failed.");
          }
        } catch {
          setActionError("Network error. Please try again.");
        }
      };

      // Delete Modal Handler
      const handleDelete = async () => {
        setActionError("");
        setActionSuccess("");
        try {
          const token = localStorage.getItem('accessToken');
          const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${deleteVenue.id}`, {
            method: "DELETE",
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
              "X-Noroff-API-Key": "c4c8769a-ba1b-401d-9367-349cc75517f4"
            }
          });
          if (response.ok) {
            setActionSuccess("Venue deleted successfully.");
            setShowDelete(false);
            // Refresh venues
            const user = JSON.parse(localStorage.getItem('user'));
            const profileName = user?.name;
            const venuesRes = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${profileName}/venues`, {
              headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
                "X-Noroff-API-Key": "c4c8769a-ba1b-401d-9367-349cc75517f4"
              }
            });
            const venuesData = await venuesRes.json();
            setVenues(venuesData.data || []);
          } else {
            const data = await response.json();
            setActionError(data.message || "Venue deletion failed.");
          }
        } catch {
          setActionError("Network error. Please try again.");
        }
      };
    const [showEdit, setShowEdit] = useState(false);
    const [editVenue, setEditVenue] = useState(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPrice, setEditPrice] = useState(100);
    const [editMaxGuests, setEditMaxGuests] = useState(1);
    const [editAddress, setEditAddress] = useState("");
    const [editCity, setEditCity] = useState("");
    const [editZip, setEditZip] = useState("");
    const [editCountry, setEditCountry] = useState("");
    const [editMediaUrl, setEditMediaUrl] = useState("");
    const [showDelete, setShowDelete] = useState(false);
    const [deleteVenue, setDeleteVenue] = useState(null);
    const [actionError, setActionError] = useState("");
    const [actionSuccess, setActionSuccess] = useState("");
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchMyVenues() {
      setLoading(true);
      setError("");
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const profileName = user?.name;
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${profileName}/venues`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "X-Noroff-API-Key": "c4c8769a-ba1b-401d-9367-349cc75517f4"
          }
        });
        const data = await res.json();
        setVenues(data.data || []);
      } catch (err) {
        setError("Failed to fetch your venues.");
        setVenues([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMyVenues();
  }, []);

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4 fw-bold text-primary">My Venues</h1>
      <p className="text-center mb-3 fs-5 text-muted">These are the venues you own. Search by name below.</p>
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search my venues by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      {actionSuccess && <div className="alert alert-success mt-3">{actionSuccess}</div>}
      {actionError && <div className="alert alert-danger mt-3">{actionError}</div>}
      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : (
        <Row className="g-4 justify-content-center">
          {venues.filter(v => v.name.toLowerCase().includes(search.toLowerCase())).map((venue) => (
            <Col key={venue.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow card-hover rounded-4 border-0">
                <div style={{height: 180, background: venue.media && venue.media.length > 0 ? `url('${venue.media[0].url}') center/cover` : `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80') center/cover`, borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem'}}></div>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="fw-semibold text-primary">{venue.name}</Card.Title>
                    <Card.Text className="mb-1 text-muted">{venue.location?.address || "No address"}</Card.Text>
                    <Card.Text className="mb-2">Max Guests: {venue.maxGuests}</Card.Text>
                  </div>
                  <div className="d-flex flex-column align-items-center mt-2 gap-2">
                    <span className="fw-bold fs-5 text-success mb-2">${venue.price || 99}/night</span>
                    <div className="d-flex gap-3">
                      <Button
                        variant="warning"
                        style={{ minWidth: 90, minHeight: 40, borderRadius: '2rem', fontWeight: 'bold' }}
                        onClick={() => {
                          setEditVenue(venue);
                          setEditName(venue.name);
                          setEditDescription(venue.description);
                          setEditPrice(venue.price);
                          setEditMaxGuests(venue.maxGuests);
                          setEditAddress(venue.location?.address || "");
                          setEditCity(venue.location?.city || "");
                          setEditZip(venue.location?.zip || "");
                          setEditCountry(venue.location?.country || "");
                          setEditMediaUrl(venue.media && venue.media[0]?.url ? venue.media[0].url : "");
                          setShowEdit(true);
                        }}
                      >Edit</Button>
                      <Button
                        variant="danger"
                        style={{ minWidth: 90, minHeight: 40, borderRadius: '2rem', fontWeight: 'bold' }}
                        onClick={() => {
                          setDeleteVenue(venue);
                          setShowDelete(true);
                        }}
                      >Delete</Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      {/* Edit Venue Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Venue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditSubmit}>
            <div className="mb-2">
              <label>Name</label>
              <input type="text" className="form-control" value={editName} onChange={e => setEditName(e.target.value)} required />
            </div>
            <div className="mb-2">
              <label>Description</label>
              <textarea className="form-control" value={editDescription} onChange={e => setEditDescription(e.target.value)} required />
            </div>
            <div className="mb-2">
              <label>Price</label>
              <input type="number" className="form-control" min={1} value={editPrice} onChange={e => setEditPrice(Number(e.target.value))} required />
            </div>
            <div className="mb-2">
              <label>Max Guests</label>
              <input type="number" className="form-control" min={1} value={editMaxGuests} onChange={e => setEditMaxGuests(Number(e.target.value))} required />
            </div>
            <div className="mb-2">
              <label>Address</label>
              <input type="text" className="form-control" value={editAddress} onChange={e => setEditAddress(e.target.value)} required />
            </div>
            <div className="mb-2">
              <label>City</label>
              <input type="text" className="form-control" value={editCity} onChange={e => setEditCity(e.target.value)} required />
            </div>
            <div className="mb-2">
              <label>Zip</label>
              <input type="text" className="form-control" value={editZip} onChange={e => setEditZip(e.target.value)} required />
            </div>
            <div className="mb-2">
              <label>Country</label>
              <input type="text" className="form-control" value={editCountry} onChange={e => setEditCountry(e.target.value)} required />
            </div>
            <div className="mb-2">
              <label>Image URL</label>
              <input type="url" className="form-control" value={editMediaUrl} onChange={e => setEditMediaUrl(e.target.value)} required />
            </div>
            <Button variant="primary" type="submit" className="w-100 mt-2">Save Changes</Button>
          </form>
        </Modal.Body>
      </Modal>
      {/* Delete Venue Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Venue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete <strong>{deleteVenue?.name}</strong>?</p>
          <Button variant="danger" className="w-100" onClick={handleDelete}>Delete</Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default MyVenues;
