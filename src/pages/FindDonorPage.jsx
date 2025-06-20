import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultPosition = [30.3753, 69.3451]; // Center of Pakistan

const FindDonorPage = () => {
  const [donors, setDonors] = useState([]);
  const [filters, setFilters] = useState({ bloodType: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const API_BASE = "http://localhost:3000/api";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchDonors = async () => {
    setLoading(true);
    let query = [];
    if (filters.bloodType) query.push(`bloodType=${filters.bloodType}`);
    if (filters.location)
      query.push(`location=${encodeURIComponent(filters.location)}`);
    const url = `${API_BASE}/users/available${
      query.length ? "?" + query.join("&") : ""
    }`;
    try {
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setDonors(data.users || []);
      }
    } catch (err) {
      setDonors([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Get user's current location for distance calculation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {}
      );
    }
    fetchDonors();
    // eslint-disable-next-line
  }, []);

  // Haversine formula for distance in km
  function getDistanceKm(lat1, lng1, lat2, lng2) {
    if (!lat1 || !lng1 || !lat2 || !lng2) return null;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Fix default marker icon for leaflet (Vite/React compatible)
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });

  // Helper to move map to user location
  function MapCenterer({ position }) {
    const map = useMap();
    useEffect(() => {
      if (position) map.setView(position, 10);
    }, [position, map]);
    return null;
  }

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDonors();
  };

  return (
    <div className="page-container">
      <h1>Find Donor</h1>
      <form
        className="donor-form"
        onSubmit={handleSearch}
        style={{ marginBottom: "2rem" }}
      >
        <div className="form-group">
          <label>Blood Type</label>
          <select
            name="bloodType"
            value={filters.bloodType}
            onChange={handleChange}
          >
            <option value="">All</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Enter location"
          />
        </div>
        <button type="submit" className="btn primary">
          Search
        </button>
      </form>
      {/* Map View */}
      <div
        style={{
          width: "100%",
          height: "350px",
          marginBottom: "2rem",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={
            userLocation
              ? [userLocation.lat, userLocation.lng]
              : defaultPosition
          }
          zoom={userLocation ? 10 : 6}
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
          {donors.map((donor) =>
            donor.locationCoords?.lat && donor.locationCoords?.lng ? (
              <Marker
                key={donor._id}
                position={[donor.locationCoords.lat, donor.locationCoords.lng]}
              >
                <Popup>
                  <strong>{donor.fullName}</strong>
                  <br />
                  Blood Type: {donor.bloodType}
                  <br />
                  Type:{" "}
                  {donor.isPaidDonor ? `Paid ($${donor.chargeAmount})` : "Free"}
                  <br />
                  Location: {donor.location}
                  {userLocation && (
                    <>
                      <br />
                      Distance:{" "}
                      {getDistanceKm(
                        userLocation.lat,
                        userLocation.lng,
                        donor.locationCoords.lat,
                        donor.locationCoords.lng
                      ).toFixed(2)}{" "}
                      km
                    </>
                  )}
                  {donor.contactPublic && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <button className="btn secondary">Contact</button>
                    </div>
                  )}
                </Popup>
              </Marker>
            ) : null
          )}
          <MapCenterer
            position={
              userLocation
                ? [userLocation.lat, userLocation.lng]
                : defaultPosition
            }
          />
        </MapContainer>
      </div>
      {/* List View */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="donor-cards">
          {donors.length === 0 ? (
            <p>No donors found.</p>
          ) : (
            donors.map((donor) => {
              const distance =
                userLocation &&
                donor.locationCoords?.lat &&
                donor.locationCoords?.lng
                  ? getDistanceKm(
                      userLocation.lat,
                      userLocation.lng,
                      donor.locationCoords.lat,
                      donor.locationCoords.lng
                    )
                  : null;
              return (
                <div className="donor-card" key={donor._id}>
                  <h3>{donor.fullName}</h3>
                  <p>Blood Type: {donor.bloodType}</p>
                  <p>Location: {donor.location}</p>
                  <p>
                    Last Donation:{" "}
                    {donor.lastDonationDate
                      ? new Date(donor.lastDonationDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    Type:{" "}
                    {donor.isPaidDonor
                      ? `Paid ($${donor.chargeAmount})`
                      : "Free"}
                  </p>
                  {distance && <p>Distance: {distance.toFixed(2)} km</p>}
                  {donor.contactPublic && (
                    <button className="btn secondary">Contact</button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default FindDonorPage;
