import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHome } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

function AppNavbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
    window.location.reload();
  };
  // Get user info and role
  let isVenueManager = false;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    // Check user object first
    if (user?.venueManager === true) {
      isVenueManager = true;
    } else {
      // Fallback: check venueManagerStatus from registration
      const venueManagerStatus = JSON.parse(localStorage.getItem('venueManagerStatus'));
      if (venueManagerStatus?.venueManager === true) {
        isVenueManager = true;
      }
    }
  } catch {}

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <FaHome size={24} className="mb-1" />
          <span style={{fontWeight:700, fontSize:'1.4rem', letterSpacing:'1px'}}>Holidaze</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto align-items-center gap-2">
            <Nav.Link as={Link} to="/venues">Venues</Nav.Link>
            <Nav.Link as={Link} to="/bookings">My Bookings</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            {isVenueManager && (
              <NavDropdown title="Management" id="management-dropdown" className="ms-2">
                <NavDropdown.Item as={Link} to="/manage-venues">Manage Venues</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/manage-bookings">Manage Bookings</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/my-venues">My Venues</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
          <Nav className="align-items-center gap-2">
            <Nav.Link as={Link} to="/register" className="px-3">Register</Nav.Link>
            <Nav.Link as={Link} to="/login" className="px-3">Login</Nav.Link>
            <Nav.Link onClick={handleLogout} style={{ color: 'white', fontWeight: 'bold', background:'#0d6efd', borderRadius:'1.5rem', padding:'0.5rem 1.2rem', marginLeft:'8px' }}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
