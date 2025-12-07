import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Venues from "./pages/Venues";
import VenueDetails from "./pages/VenueDetails";
import Search from "./pages/Search";
import Register from "./pages/Register";
import Calendar from "./pages/Calendar";
import Login from "./pages/Login";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import ManageVenues from "./pages/ManageVenues";
import ManageBookings from "./pages/ManageBookings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/venue/:id" element={<VenueDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/register" element={<Register />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/manage-venues" element={<ManageVenues />} />
        <Route path="/manage-bookings" element={<ManageBookings />} />
      </Routes>
    </Router>
  );
}

export default App;
