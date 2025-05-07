import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Vehicle icon
const vehicleIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/744/744465.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

function App() {
  const [position, setPosition] = useState(null);
  const [path, setPath] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const fetchLocation = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/location');
      const { latitude, longitude } = res.data;
      const newPos = [latitude, longitude];
      setPosition(newPos);
      setPath(prev => [...prev, newPos]);
    } catch (err) {
      console.error('Error fetching location:', err);
    }
  };

  useEffect(() => {
    if (isRunning) {
      fetchLocation();
      intervalRef.current = setInterval(fetchLocation, 3000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      {/* Play/Pause Button */}
      <div style={{ position: 'absolute', top: 20, left: 80, zIndex: 1000 }}>
        <button onClick={() => setIsRunning(prev => !prev)}>
          {isRunning ? '⏸ Pause' : '▶️ Play'}
        </button>
      </div>

      <MapContainer
        center={[17.385044, 78.486671]}
        zoom={17}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {position && <Marker position={position} icon={vehicleIcon} />}
        {path.length > 1 && <Polyline positions={path} color="blue" />}
      </MapContainer>
    </div>
  );
}

export default App;
